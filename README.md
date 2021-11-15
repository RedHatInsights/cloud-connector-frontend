- [Cloud Connector Frontend](#cloud-connector-frontend)
- [Requirements](#requirements)
- [Install](#install)
- [Run locally](#run-locally)
  - [Environmental variables available](#environmental-variables-available)
- [Build](#build)
- [Test](#test)
  - [--watchAll](#--watchall)
- [Lint](#lint)
  - [--fix](#--fix)
- [Documentation](#documentation)
- [License](#license)

# Cloud Connector Frontend
# Requirements

- node 16+

# Install

`yarn`

Do everytime when dependencies are changed.

If you encounter any issues with dependencies, try to remove `yarn.lock` file and `node_modules` folder to remove any cached packages: `rm -rf yarn.lock node_modules`.

# Run locally

`yarn start`

The application is served on `http://localhost:3000/`.

## Environmental variables available

|Name|Description|Example|
|----|-------|-----------|
|`CONNECTOR_API`|An URL to cloud connector application.|`CONNECTOR_API=http://localhost:8000 yarn start`|

# Build

`yarn build`

Builds production ready static files.
# Test

`yarn test`

Coverage is collected automatically.

## --watchAll

`yarn test --watchAll`

Watches all the files for changes.

# Lint

`yarn lint`

Checks JS for formatting.

## --fix

`yarn lint --fix`

Automatically fixes issues. More complex issues has to be fixed manually.

# Documentation

- [Technologies](./doc/technologies.md)

# License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).