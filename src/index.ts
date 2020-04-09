import { readFileSync, readdirSync } from 'fs';
import * as fsx from 'fs-extra';

interface PackageJsonMapInterface {
  /** the location of the package.json **/
  location: string;
  /** the only 2 sections of package.json that we need to parse **/
  content: {
    name: string;
    dependencies: object;
  };
}

interface CopyToInterface {
  /** the directory of the actual module **/
  copy: string;
  /** the directory of the node_module that code should be copied too **/
  to: string;
}

interface InputInterface {
  /** The alternate location to the lerna.json **/
  lernaLocation?: string;
}

interface GetConfigOutputInterface {
  /** the list of packages to check for in lerna.json **/
  packages: string[];
  /** The version control method of lerna **/
  version: string;
}

interface GetPackageNameListOutputInterface {
  /** The name of the package **/
  name: string;
  /** the location of the package **/
  location: string;
}

interface GetPackagesToUpdateInterface {
  packageNameList: GetPackageNameListOutputInterface[];
  packageJsonMap: PackageJsonMapInterface[];
}

/**
 * Gets the config file for lerna
 *
 * @function getConfig
 * @param {InputInterface} input - Options that you can run dewey with
 * @return {GetConfigOutputInterface}
 */
const getConfig = (input?: InputInterface): GetConfigOutputInterface => {
  const lernaConfigLocation =
    (input && input?.lernaLocation) || `${process.cwd()}/lerna.json`;
  return JSON.parse(readFileSync(lernaConfigLocation).toString());
};

/**
 * Gets the subdirectories of all of the available packages
 *
 * @function getSubdirectories
 * @param {GetConfigOutputInterface} input - lerna.json or whatever config you're using
 * @return {string[]} - all of the subdirectories available
 */
const getSubdirectories = (input: GetConfigOutputInterface): string[] =>
  input.packages.map((packageName: string) =>
    packageName.replace('/*', '').replace('//', ''),
  );

/**
 * Gather's the directories of all local packages
 *
 * @function getPackageDirectories
 * @param {string[]} input - subdirectories with their file handling information removed
 * @return {string[]} - cleaned directories
 */
const getPackageDirectories = (input: string[]): string[] =>
  input
    .map((location: string) =>
      readdirSync(`${location}`).map(
        (packageName: string) => `${location}/${packageName}`,
      ),
    )
    .flat();

/**
 * packageJsonMap
 *
 * @function getPackageJsonMap
 * @param {string[]} input - an array of string of package.jsons
 * @return {PackageJsonMapInterface[]}
 */
const getPackageJsonMap = (input: string[]) =>
  input.map(
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

/**
 * Gets the name of each package, and its location
 *
 * @function getPackageNameList
 * @param {PackageJsonMapInterface[]} input
 * @return {GetPackagesToUpdateInterface}
 */
const getPackageNameList = (
  input: PackageJsonMapInterface[],
): GetPackagesToUpdateInterface => {
  const packageNameList = input.map((packageJson: PackageJsonMapInterface) => ({
    name: packageJson.content.name,
    location: packageJson.location,
  }));
  return {
    packageNameList,
    packageJsonMap: input,
  };
};

/**
 * Get a list of packages, and where to copy them to
 *
 * @function getPackagesToUpdate
 * @param {GetPackagesToUpdateInterface} input
 * @return {CopyToInterface|undefined}
 */
const getPackagesToUpdate = (
  input: GetPackagesToUpdateInterface,
): (CopyToInterface | undefined)[] =>
  input.packageJsonMap
    .map((packageJson) => {
      const deps = input.packageNameList.map((packageName):
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

/**
 * Simple compose
 *
 * @function compose
 * @param {Function[]} fns - an array of functions
 * @return {[TODO:type]} returns anything
 */
const compose = (...fns: Function[]) => (x: any) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const composed = compose(
  getPackagesToUpdate,
  getPackageNameList,
  getPackageJsonMap,
  getPackageDirectories,
  getSubdirectories,
  getConfig,
);

/**
 * Checks package.json recursively in a lerna project and copies
 * that file into its node_modules.
 *
 * @async
 * @param {@link InputInterface} input - an input object for settings
 * @return {Promise<void>} - this is a void
 **/
async function main(input?: InputInterface): Promise<void> {
  const packagesToUpdate = composed(input);
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
