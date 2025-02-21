import bewareExceptions from "../beware-exceptions"
import { IgnoreListRef } from "../types/ignore-list"
import { UnifiedWallet, UnifiedWalletDescriptor, WalletType } from "../types/wallet"
import createUnifiedWallet from "./create-unified-wallet"

interface DetectWalletOptions {
  descriptors: UnifiedWalletDescriptor[]
  type: WalletType
  walletsList: Record<string, UnifiedWallet>
  setWalletsList: (key: string, update: UnifiedWallet) => any
  ignoreListRef?: IgnoreListRef
}

export default function detectWallets(options: DetectWalletOptions) {
  const { ignoreListRef, setWalletsList, walletsList, descriptors, type } = options
  // List of installed wallets

  descriptors.forEach(descriptor => {
    bewareExceptions(() => {
      const provider = descriptor.provider(window) as any

      setWalletsList(descriptor.uuid, createUnifiedWallet({
        wallet: {
          originalProvider: provider,
          provider: () => provider,
          info: {
            name: descriptor.name,
            icon: descriptor.icon,
            uuid: descriptor.uuid
          },
          supports: {
            requestPermissions: descriptor.supports?.requestPermissions || false,
            disconnectMethod: descriptor.supports?.disconnectMethod || false
          },
          type
        },
        ignoreListRef
      }))
    }, false)
  })

  return () => Object.values(walletsList)
}
