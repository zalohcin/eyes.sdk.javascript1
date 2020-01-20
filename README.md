# eyes-sdk-javascript

## Building

__NOTE: [yarn](https://yarnpkg.com/lang/en/) is a dependency.

### Getting Started

Run the following from the root of the repo.

```sh
> yarn install
```

This will install the dependencies for the mono root, all packages, and link internal dependencies together.

### To disable linking (per package)

You can perform a focused installation of a package.

```sh
> cd packages/eyes-selenium
> yarn install --focused
```

__NOTE: this will only work for packages that are publicly available on `npm`. For details, read more [here](https://yarnpkg.com/blog/2018/05/18/focused-workspaces/).__

### Linting

Just like with `npm` you can run scripts.

Case-in-point, linting can be run this way. Either for all packages from the project root, or from an individual package.

```sh
> yarn run lint
```

or

```sh
> cd packages/eyes-selenium
> yarn run lint
```
