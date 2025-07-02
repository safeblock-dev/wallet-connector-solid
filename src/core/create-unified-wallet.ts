import { ConnectOps } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider"
import { Network } from "ethers"
import connectInpageEthereum from "../connectors/ethereum"
import connectWalletConnect from "../connectors/ethereum.walletconnect"
import { IgnoreListRef } from "../types/ignore-list"
import { UnifiedWallet, UnifiedWalletMetadata, WalletType } from "../types/wallet"


const unifiedWallets = new Map<string, UnifiedWallet>()

interface UnifiedWalletCreationOptions {
  wallet: UnifiedWalletMetadata
  onUpdate?: () => void
  onDisconnect?: () => Promise<void>
  ignoreListRef?: IgnoreListRef
}

function defineConnector(wallet: UnifiedWalletMetadata) {
  if (wallet.walletConnectProvider) return connectWalletConnect

  return {
    [WalletType.Ton]: connectInpageEthereum,
    [WalletType.Ethereum]: connectInpageEthereum,
    [WalletType.Tron]: connectInpageEthereum
  }[wallet.type]
}

/**
 * Create a unified wallet description object
 *
 * @param options unified wallet creation options
 */
export default function createUnifiedWallet(options: UnifiedWalletCreationOptions): UnifiedWallet {
  const { wallet, onDisconnect, onUpdate, ignoreListRef } = options

  if (unifiedWallets.has(wallet.info.uuid)) return unifiedWallets.get(wallet.info.uuid)!

  const connector = defineConnector(wallet)

  if (wallet.originalProvider && "on" in wallet.originalProvider) {
    wallet.originalProvider.on("accountsChanged", () => onUpdate?.())
    wallet.originalProvider.on("chainChanged", () => onUpdate?.())
  }

  const unifiedWallet: UnifiedWallet = {
    ...wallet,

    connect: async (opts?: ConnectOps) => {
      const result = await connector(wallet.walletConnectProvider ?? wallet.provider(Network.from(1)) as any, opts)

      if (result) ignoreListRef?.delete(wallet.info.name)

      return result
    },

    disconnect: async () => {
      if (onDisconnect) return onDisconnect()
    },

    equalTo: walletOrUUID => typeof walletOrUUID === "string"
      ? (walletOrUUID === wallet.info.uuid)
      : walletOrUUID.info.uuid === wallet.info.uuid
  }

  unifiedWallets.set(wallet.info.uuid, unifiedWallet)
  return unifiedWallet
}
