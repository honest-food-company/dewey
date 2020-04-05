"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fsx = require("fs-extra");
/**
 * Checks package.json recursively in a lerna project and copies
 * that file into its node_modules.
 *
 * @async
 * @param {@link InputInterface} input - an input object for settings
 * @return {Promise<void>} - this is a simple void function
 */
async function main(input) {
    const lernaConfigLocation = (input && (input === null || input === void 0 ? void 0 : input.lernaLocation)) || `${process.cwd()}/lerna.json`;
    const lernaConfig = JSON.parse(fs_1.readFileSync(lernaConfigLocation).toString());
    // striping all the directory commands
    const packageSubDir = lernaConfig.packages.map((packageName) => packageName.replace('/*', '').replace('//', ''));
    // grabs packages directory array and flattens it
    const packagesDir = packageSubDir
        .map((location) => fs_1.readdirSync(`${location}`).map((packageName) => `${location}/${packageName}`))
        .flat();
    // Grabs each of the lerna package's package.json and returns it with its location
    const packageJsonMap = packagesDir.map((packageLocation) => {
        const stringedJson = fs_1.readFileSync(`${process.cwd()}/${packageLocation}/package.json`).toString();
        return {
            location: packageLocation,
            content: JSON.parse(stringedJson),
        };
    });
    // gets the package names and lists and their file location
    const packageNameList = packageJsonMap.map((packageJson) => ({
        name: packageJson.content.name,
        location: packageJson.location,
    }));
    // checks for dependencies that need to be hard copied and returns what and where to copy to
    const packagesToUpdate = packageJsonMap
        .map((packageJson) => {
        // checks the deps of each package if any local lerna packages need to be pushed to it.
        // TODO: convert this to a reduce
        const deps = packageNameList.map((packageName) => {
            if (Object.keys(packageJson.content.dependencies).includes(packageName.name)) {
                return {
                    copy: `${process.cwd()}/${packageName.location}`,
                    to: `${process.cwd()}/${packageJson.location}/node_modules/${packageName.name}`,
                };
            }
            return undefined; // simple solution to filter later
        });
        return deps; // returns friendly copy/to format
    })
        .flat() // flattens the array
        .filter((dep) => dep !== undefined); // removes all undefined
    const fileCopyArray = packagesToUpdate.map(async (packageToUpdate) => {
        const { copy, to } = packageToUpdate;
        await fsx.remove(to); // removes the symlink
        await fsx.copy(copy, to); // copies code into node_modules
    });
    Promise.all(fileCopyArray);
}
exports.default = main;
//# sourceMappingURL=index.js.map