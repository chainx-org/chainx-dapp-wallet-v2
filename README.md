[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://chainx.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://github.com/chainx-org/chainx-dapp-wallet-v2)

# Chainx Dapp Wallet

A Portal into the Chainx and Substrate networks. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via https://dapps.chainx.org.

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [apps-electron](packages/apps-electron/) Desktop app running [apps](packages/apps/).
- [page-accounts-chainx](packages/page-accounts-chainx/) A basic account asset app.
- [page-democracy-chainx](packages/page-democracy-chainx/) A basic voting app, allowing votes on activate proposals and referenda.
- [page-explorer-chainx](packages/page-explorer-chainx/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-js](packages/page-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [page-settings-chainx](packages/page-settings-chainx/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage-chainx](packages/page-storage-chainx/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [page-toolbox](packages/page-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [page-transfer](packages/page-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.
- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## Development

Contributions are welcome!

To start off, this repo (along with others in the [@chainx](https://github.com/chainx-org/) family) uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/chainx-org/chainx-dapp-wallet-v2.git <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn install`
5. Ready! Now you can launch the UI (assuming you have a local Chainx Node running), via `yarn start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## Desktop App

The main advantage of using Desktop App is that it by default stores encrypted accounts on the filesystem instead of browser's local storage.
Local storage is susceptible to attacks using XSS (Cross-Site Scripting). There's no such risk when with files stored on disk.

The desktop app uses the [Electron](https://www.electronjs.org/) framework. It provides the same features as web app, the only difference
being different account storage.

To get started -

```
yarn start:electron
```
