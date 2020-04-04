# dewey
Dewey is a simple system for replacing symlinks in lerna with the actual local packages.  It uses introspection to find what lerna packages exist.

### Why is this useful?
It's useful because serverless exists, and the concept of code splitting is hard. It makes sense for each serverless function its own function. By using dewey we have the capability to code split and use code from other packages in our lerna repo, and when we wnat to deploy them, we can remove the symlinks and push modules up.

Think of this:
