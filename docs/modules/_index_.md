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

*Defined in [index.ts:35](https://github.com/samrocksc/dewey/blob/2cf792a/src/index.ts#L35)*

Checks package.json recursively in a lerna project and copies
that file into its node_modules.

**`async`** 

**Parameters:**

Name | Type |
------ | ------ |
`input?` | [InputInterface](../interfaces/_index_.inputinterface.md) |

**Returns:** *Promise‹void›*

- this is a simple void function
