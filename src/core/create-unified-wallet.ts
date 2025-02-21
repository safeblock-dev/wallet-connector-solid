import connectInpageEthereum from "../connectors/ethereum"
import connectWalletconnect from "../connectors/ethereum.walletconnect"
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
  if (wallet.walletConnectProvider) return connectWalletconnect

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

    connect: async () => {
      const result = await connector(wallet.walletConnectProvider ?? wallet.provider() as any)
      if (result) ignoreListRef?.delete(wallet.info.uuid)
      else ignoreListRef?.add(wallet.info.uuid)

      return result
    },

    disconnect: async () => {
      if (onDisconnect) return onDisconnect()

      //if (wallet.type !== WalletType.Ton) return
      //
      //await cast<TonConnectUI>(wallet.provider()).disconnect()
    },

    equalTo: walletOrUUID => typeof walletOrUUID === "string"
      ? (walletOrUUID === wallet.info.uuid)
      : walletOrUUID.info.uuid === wallet.info.uuid
  }

  unifiedWallets.set(wallet.info.uuid, unifiedWallet)
  return unifiedWallet
}
