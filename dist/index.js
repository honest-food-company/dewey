const { readFileSync, readdirSync } = require('fs');
const fsx = require('fs-extra');
const main = async (lernaJson) => {
    const lernaConfigLocation = lernaJson || `${process.cwd()}/lerna.json`;
    const lernaConfig = JSON.parse(readFileSync(lernaConfigLocation).toString());
    // striping all the directory commands
    const packageSubDir = lernaConfig.packages.map((packageName) => packageName.replace('/*', '').replace('//', ''));
    // grabs packages directory array and flattens it
    const packagesDir = packageSubDir
        .map((location) => readdirSync(`${location}`).map((packageName) => `${location}/${packageName}`))
        .flat();
    // Grabs each of the lerna package's package.json and returns it with its location
    const packageJsonMap = packagesDir.map((packageLocation) => {
        const stringedJson = readFileSync(`${process.cwd()}/${packageLocation}/package.json`).toString();
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
};
module.exports = main;
module.exports.default = main;
//# sourceMappingURL=index.js.map