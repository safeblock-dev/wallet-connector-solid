import { BrowserProvider, Eip1193Provider } from "ethers"
import EthereumProvider from "@walletconnect/ethereum-provider"
import { TronWeb } from "tronweb"
import { TonConnectUI } from "@tonconnect/ui"


export enum WalletType {
  Tron,
  Ethereum,
  Ton
}

export type UnifiedWalletInfo = {
  /** Wallet display name */
  name: string

  /** Wallet internal identifier */
  uuid: string

  /** Wallet icon */
  icon: string
}

export type UnifiedWalletMethodsSupportInfo = {
  /** Is wallet accept requestPermissions request */
  requestPermissions: boolean

  /** Is wallet supports account disconnection */
  disconnectMethod: boolean
}

/**
 * Wallet metadata
 */
export type UnifiedWalletMetadata = {
  /** Wallet provider */
  provider: () => (BrowserProvider | TronWeb | TonConnectUI)

  /**
   * Original wallet provider
   *
   * At this time for non-evm chains will be the same as `provider`.
   * Will not be set for WalletConnect wallet
   * */
  originalProvider?: EthereumProvider | Eip1193Provider

  /** WalletConnect provider reference */
  walletConnectProvider?: EthereumProvider

  /** Primary wallet info */
  info: UnifiedWalletInfo

  /** List of additional methods that accepts (or not accepts) current wallet */
  supports: UnifiedWalletMethodsSupportInfo

  /** Type of the wallet */
  type: WalletType
}

export type UnifiedWallet = UnifiedWalletMetadata & {
  /** Check if a specific wallet instance or UUID is equal to the current wallet */
  equalTo(walletOrUUID: UnifiedWallet | string): boolean

  /** Connect account using the current wallet */
  connect(): Promise<boolean>

  /**
   * Disconnect current wallet
   *
   * At this time works only for TON Connect instance
   */
  disconnect(): Promise<void>
}

export type UnifiedWalletDescriptor = {
  /** Wallet internal identifier */
  uuid: string

  /** Wallet display name */
  name: string

  /** Current wallet provider reference */
  provider: (runtime: Record<any, any>) => TronWeb | Eip1193Provider | TonConnectUI

  /** Wallet icon */
  icon: string

  /** Partial list of additional methods that accepts (or not accepts) current wallet */
  supports?: Partial<UnifiedWalletMethodsSupportInfo>
}
