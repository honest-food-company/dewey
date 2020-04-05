import { readFileSync, readdirSync } from 'fs';
import * as fsx from 'fs-extra';

/**
 * grabs the lerna config, and then does a deep search of all packages and hard copies
 * the node_modules that need to be
 */

interface PackageJsonMapInterface {
  location: string;
  content: {
    name: string;
    dependencies: object;
  };
}

interface CopyToInterface {
  copy: string;
  to: string;
}

interface InputInterface {
  packageDir?: string;
}

/**
 * Checks package.json recursively in a lerna project and copies
 * that file into its node_modules.
 *
 * @async
 * @param {InputInterface} input - an input object for settings
 * @return {Promise<void>} - this is a simple void function
 */
async function main(input?: InputInterface): Promise<void> {
  const lernaConfigLocation =
    (input && input?.packageDir) || `${process.cwd()}/lerna.json`;
  const lernaConfig = JSON.parse(readFileSync(lernaConfigLocation).toString());
  // striping all the directory commands
  const packageSubDir = lernaConfig.packages.map((packageName: string) =>
    packageName.replace('/*', '').replace('//', ''),
  );
  // grabs packages directory array and flattens it
  const packagesDir = packageSubDir
    .map((location: string) =>
      readdirSync(`${location}`).map(
        (packageName: string) => `${location}/${packageName}`,
      ),
    )
    .flat();
  // Grabs each of the lerna package's package.json and returns it with its location
  const packageJsonMap = packagesDir.map(
    (packageLocation: string): PackageJsonMapInterface => {
      const stringedJson = readFileSync(
        `${process.cwd()}/${packageLocation}/package.json`,
      ).toString();
      return {
        location: packageLocation,
        content: JSON.parse(stringedJson),
      };
    },
  ) as PackageJsonMapInterface[];
  // gets the package names and lists and their file location
  const packageNameList = packageJsonMap.map(
    (packageJson: PackageJsonMapInterface) => ({
      name: packageJson.content.name,
      location: packageJson.location,
    }),
  );
  // checks for dependencies that need to be hard copied and returns what and where to copy to
  const packagesToUpdate = packageJsonMap
    .map((packageJson) => {
      // checks the deps of each package if any local lerna packages need to be pushed to it.
      // TODO: convert this to a reduce
      const deps = packageNameList.map((packageName):
        | CopyToInterface
        | undefined => {
        if (
          Object.keys(packageJson.content.dependencies).includes(
            packageName.name,
          )
        ) {
          return {
            copy: `${process.cwd()}/${packageName.location}`,
            to: `${process.cwd()}/${packageJson.location}/node_modules/${
              packageName.name
            }`,
          };
        }
        return undefined; // simple solution to filter later
      });
      return deps; // returns friendly copy/to format
    })
    .flat() // flattens the array
    .filter((dep: CopyToInterface | undefined) => dep !== undefined); // removes all undefined

  const fileCopyArray = packagesToUpdate.map(
    async (packageToUpdate: CopyToInterface): Promise<void> => {
      const { copy, to } = packageToUpdate;
      await fsx.remove(to); // removes the symlink
      await fsx.copy(copy, to); // copies code into node_modules
    },
  );
  Promise.all(fileCopyArray);
}

export default main;
