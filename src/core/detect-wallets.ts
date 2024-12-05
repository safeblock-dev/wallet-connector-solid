import bewareExceptions from "../beware-exceptions"
import { UnifiedWallet, UnifiedWalletDescriptor, WalletType } from "../types/wallet"
import createUnifiedWallet from "./create-unified-wallet"

export default function detectWallets(
  descriptors: UnifiedWalletDescriptor[],
  type: WalletType,
  walletsList: Record<string, UnifiedWallet>,
  setWalletsList: (key: string, update: UnifiedWallet) => any
) {
  // List of installed wallets

  descriptors.forEach(descriptor => {
    bewareExceptions(() => {
      const provider = descriptor.provider(window) as any

      setWalletsList(descriptor.uuid, createUnifiedWallet({
        originalProvider: provider,
        provider: provider,
        info: {
          name: descriptor.name,
          icon: descriptor.icon,
          uuid: descriptor.uuid
        },
        supports: {
          requestPermissions: descriptor.supports?.requestPermissions || false
        },
        type
      }))
    }, false)
  })

  return () => Object.values(walletsList)
}
