[dewey](../README.md) › [Globals](../globals.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Interfaces

* [CopyToInterface](../interfaces/_index_.copytointerface.md)
* [InputInterface](../interfaces/_index_.inputinterface.md)
* [PackageJsonMapInterface](../interfaces/_index_.packagejsonmapinterface.md)

### Functions

* [main](_index_.md#main)

## Functions

###  main

▸ **main**(`input?`: [InputInterface](../interfaces/_index_.inputinterface.md)): *Promise‹void›*

*Defined in [index.ts:34](https://github.com/samrocksc/dewey/blob/51716d8/src/index.ts#L34)*

Checks package.json recursively in a lerna project and copies
that file into its node_modules.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input?` | [InputInterface](../interfaces/_index_.inputinterface.md) | an input object for settings |

**Returns:** *Promise‹void›*

- this is a simple void function
