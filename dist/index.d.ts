declare const readFileSync: any, readdirSync: any;
declare const fsx: any;
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
declare const main: (lernaJson?: string) => Promise<void>;
