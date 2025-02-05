import { TonConnectUI } from "@tonconnect/ui"
import { UnifiedWallet, UnifiedWalletMetadata, WalletType } from "../types/wallet"
import connectWalletconnect from "../connectors/ethereum.walletconnect"
import connectTon from "../connectors/ton"
import connectInpageEthereum from "../connectors/ethereum"
import connectInpageTron from "../connectors/tron"
import cast from "../cast"

const unifiedWallets = new Map<string, UnifiedWallet>()

function defineConnector(wallet: UnifiedWalletMetadata) {
  if (wallet.walletConnectProvider) return connectWalletconnect

  return {
    [WalletType.Ton]: connectTon,
    [WalletType.Ethereum]: connectInpageEthereum,
    [WalletType.Tron]: connectInpageTron
  }[wallet.type]
}

/**
 * Create a unified wallet description object
 *
 * @param wallet unified wallet metadata
 * @param onUpdate fires when accounts or chain of connected accounts changes
 * @param onDisconnect
 */
export default function createUnifiedWallet(wallet: UnifiedWalletMetadata, onUpdate?: () => void, onDisconnect?: () => Promise<void>): UnifiedWallet {
  if (unifiedWallets.has(wallet.info.uuid)) return unifiedWallets.get(wallet.info.uuid)!

  const connector = defineConnector(wallet)

  if (wallet.originalProvider && "on" in wallet.originalProvider) {
    wallet.originalProvider.on("accountsChanged", () => onUpdate?.())
    wallet.originalProvider.on("chainChanged", () => onUpdate?.())
  }

  const unifiedWallet: UnifiedWallet = {
    ...wallet,

    connect: () => {
      return connector(wallet.walletConnectProvider ?? wallet.provider() as any)
    },

    disconnect: async () => {
      if (onDisconnect) return onDisconnect()

      if (wallet.type !== WalletType.Ton) return

      await cast<TonConnectUI>(wallet.provider()).disconnect()
    },

    equalTo: walletOrUUID => typeof walletOrUUID === "string"
      ? (walletOrUUID === wallet.info.uuid)
      : walletOrUUID.info.uuid === wallet.info.uuid
  }

  unifiedWallets.set(wallet.info.uuid, unifiedWallet)
  return unifiedWallet
}
