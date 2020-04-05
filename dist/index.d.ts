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
declare function main(input?: InputInterface): Promise<void>;
export default main;
