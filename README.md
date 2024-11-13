# SafeBlock Wallet Connector

A comprehensive library that enables seamless connection to multiple blockchain 
wallets (TON, TRON, and EVM-compatible wallets) with advanced features for managing multiple 
accounts per wallet and simultaneous connections to multiple wallets.

## Table of contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [EVM networks](#evm-networks)
  - [Non-EVM networks](#non-evm-networks)
- [License](#license)

## Features
- Multi-Wallet Support: Connect to TON, TRON, and EVM-compatible wallets.
- Multiple Accounts per Wallet: Manage several accounts within each wallet type.
- Parallel Connections: Maintain active connections to several wallets simultaneously.
- SolidJS for State Management: Efficient, reactive state management using SolidJS for a responsive and modular experience.

## Installation

Install the library via npm...
```shell
npm add @safeblock/wallet-connector-solid
```

...or any other package manager you like:
```shell
yarn[pnpm, etc..] install @safeblock/wallet-connector-solid
```
## Usage

This section will show examples of how to use the library.

### EVM networks

Below is an example of a simple application that allows you to connect an account through 
a specific wallet and display its address

```tsx
import { detectEthereumAccounts, detectEthereumWallets } from "@safeblock/wallet-connector-solid"

function Component() {
  const wallets = detectEthereumWallets("wc-project-id", () => {
    accounts.updateAccounts()
  })

  const accounts = detectEthereumAccounts(wallets)

  return (
    <For each={ wallets() }>
      { wallet => (
        <div>
          { wallet.name }
          <button onClick={ () => wallet.connect() }>Connect</button>

          <For each={ accounts.ofWallet(wallet) }>
            { account => <span>{ account.address }</span> }
          </For>
        </div>
      ) }
    </For>
  )
}
```

The detectEthereumAccounts function will automatically detect all installed wallets that 
support the `eip6963` standard. For non-evm networks or for wallets that do not support the 
`eip6963` standard, you can explicitly specify descriptors.

```ts
import { ethereumWalletDescriptors } from "@safeblock/wallet-connector-solid"

const wallets = detectEthereumWallets("wc-project-id", () => {
  // ...
}, ethereumWalletDescriptors)
```

Thus, wallets for which descriptors were explicitly specified will be added in addition to the found wallets. For non-evm networks, specifying descriptors is mandatory.

_Note: although we provide some descriptors right inside the package, you can still write them yourself_

### Non-EVM networks

Example of obtaining a list of wallets and accounts in the Tron network:

```ts
import { tronWalletDescriptors } from "@safeblock/wallet-connector-solid"
import { detectAccounts, detectWallets, WalletType, TronWeb } from "@safeblock/wallet-connector-solid"


const wallets = detectWallets(tronWalletDescriptors, WalletType.Tron)

// In this line provider is just a TronWeb instance from each provided wallet
const accounts = detectAccounts<TronWeb>(wallets, provider => provider.defaultAddress.base58)
```

## License
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](LICENSE)
