/**
 * The input interface
 * @param lernaLocation - the location  of the lerna.json you would like to use
 */
interface InputInterface {
    lernaLocation?: string;
}
/**
 * Checks package.json recursively in a lerna project and copies
 * that file into its node_modules.
 *
 * @async
 * @param {@link InputInterface} input - an input object for settings
 * @return {Promise<void>} - this is a simple void function
 */
declare function main(input?: InputInterface): Promise<void>;
export default main;
