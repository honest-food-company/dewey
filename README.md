Dewey is a simple system for replacing symlinks in lerna with the actual local packages.  It uses introspection to find what lerna packages exist.

[Documentation](https://samrocksc.github.io/dewey/index.html)

### What issue is dewey solving?
The typical workflow for a lambda function is: develop->package->upload->run.

### TODO
- [ ] Allow a single package to be targeted
- [ ] Allow a single directory to be targeted
- [ ] Allow a cleanup step which ideally would just be removing packages and running lerna bootstrap.
- [ ] Tests

When developing in a monorepo of multiple functions we end up duplicating a _lot_ of code.  Dewey aims to leverage the power of [lerna](https://github.com/lerna/lerna) to be able to remove the symlinks lerna provides in mono repo `node_modules` and replace it with the actual package from the repo.  Allowing for development via symlinks, yet allowing for seemless deployment.
### Why is this useful?
Dewey aims to bridge the gap between lerna and succesfully deploying shared code in a serverless project.  Lerna does not play well with serverless function deployment because of the symlinking when we are packaging our serverless functions for upload to their environments(Google Cloud Functions, AWS Lambda).  It allows us to remove the symlinks and pack the

### Bridging the gap for learning and deploying
There has always beeen a huge pain point in learning serverless functions.  This allows us to realize that we can have multiple functions in one repo and and they can dependon eachother. Dewey makes lerna a viable candidate for monorepo management

Deploying serverless functions normally involves using some kind of tool(cloudformation, terraform).  When we add dewey as a step to our deployment workflow, we can simply package and deploy our latest code.

### Scope
The scope of this project is to simply provide a tool for deployment and to make lerna more powerful.

### What it does
- It packages up node specific code.

### What it does not do
- It does not do any transpilation
- It does not work with non-package.json systems.

### Warnings
It does make use of the `fs-extra` package to remove and copy symlinks and packages

### Usage

```javascript
const dewey = require('dewey');

dewey();
```
