import detectAccounts, { AccountDetails } from "./core/detect-accounts"
import detectWallets from "./core/detect-wallets"
import detectEthereumWallets from "./core/ethereum-override/detect-ethereum-wallets"
import detectEthereumAccounts, { EthereumAccountDetails } from "./core/ethereum-override/detect-ethereum-accounts"
import { UnifiedWallet, WalletType } from "./types/wallet"
import { TronWeb } from "tronweb"
import { TonConnectUI } from "@tonconnect/ui"

export type WalletStore = Record<string, UnifiedWallet>

export {
  detectAccounts,
  detectWallets,
  detectEthereumAccounts,
  detectEthereumWallets,
  WalletType,
  TronWeb,
  TonConnectUI,

  type UnifiedWallet,
  type EthereumAccountDetails,
  type AccountDetails
}
