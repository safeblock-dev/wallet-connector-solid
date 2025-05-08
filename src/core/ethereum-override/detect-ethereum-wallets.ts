import EthereumProvider, { EthereumProviderOptions } from "@walletconnect/ethereum-provider"
import { BrowserProvider } from "ethers"
import bewareExceptions from "../../beware-exceptions"
import { Eip6963AnnounceEvent } from "../../types/eip6963"
import { IgnoreListRef } from "../../types/ignore-list"
import { UnifiedWallet, UnifiedWalletDescriptor, WalletType } from "../../types/wallet"
import walletConfig from "../../wallet-config"
import createUnifiedWallet from "../create-unified-wallet"

/** UUID verification regular expression */
const uuidRegex =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$|^0{8}-0{4}-0{4}-0{4}-0{12}$/u

interface DetectEthereumWalletsOptions {
  wcProjectId: string
  walletsList: Record<string, UnifiedWallet>
  setWalletsList: (key: string, update: UnifiedWallet) => any
  onUpdate?: () => any
  descriptors?: UnifiedWalletDescriptor[]
  ethereumProviderOptions?: EthereumProviderOptions
  ignoreListRef?: IgnoreListRef
}

/**
 * Detect all installed eip6963-compatible wallets
 */
export default function detectEthereumWallets(options: DetectEthereumWalletsOptions) {
  const { wcProjectId, onUpdate, setWalletsList, walletsList, ethereumProviderOptions, descriptors } = options
  // Process wallet descriptors if any
  // TODO: combine with detectWallets function (duplicate)
  descriptors?.forEach(descriptor => {
    bewareExceptions(() => {
      // Get provider from window runtime
      const provider = descriptor.provider(window) as any

      setWalletsList(descriptor.uuid, createUnifiedWallet({
        wallet: {
          originalProvider: provider,
          provider: (network) => new BrowserProvider(provider, undefined, { staticNetwork: network }),
          info: {
            name: descriptor.name,
            icon: descriptor.icon,
            uuid: descriptor.uuid
          },
          supports: {
            requestPermissions: descriptor.supports?.requestPermissions || false,
            disconnectMethod: descriptor.supports?.disconnectMethod || false
          },
          type: WalletType.Ethereum
        },
        ignoreListRef: options.ignoreListRef,
        onUpdate
      }))
    }, false)
  })

  // Initialize WalletConnect provider
  bewareExceptions(() => EthereumProvider.init(ethereumProviderOptions ?? {
    chains: [1],
    showQrModal: true,
    projectId: wcProjectId,
    qrModalOptions: {
      enableExplorer: Boolean(navigator.maxTouchPoints || "ontouchstart" in document.documentElement) ?? false,
      explorerExcludedWalletIds: "ALL",
      explorerRecommendedWalletIds: walletConfig.map(w => w.id)
    }
  }))?.then(provider => {
    if (provider.namespace in walletsList) return
    const unifiedWallet = createUnifiedWallet({
      wallet: {
        provider: (network) => new BrowserProvider(provider, undefined, { staticNetwork: network }),
        walletConnectProvider: provider,
        info: {
          name: "WalletConnect",
          icon: "https://raw.githubusercontent.com/safeblock-dev/wallet-connector-solid/refs/heads/main/public/icons/walletconnect.png",
          uuid: provider.namespace
        },
        supports: {
          requestPermissions: false,
          disconnectMethod: true
        },
        type: WalletType.Ethereum
      },
      ignoreListRef: options.ignoreListRef,
      onUpdate,
      onDisconnect: () => provider.disconnect()
    })

    setWalletsList(provider.namespace, unifiedWallet)
  })

  // eip6963 announce provider event handler
  const handleAnnounceEvent = (event: Eip6963AnnounceEvent) => {
    if (!event.detail) return

    try {
      const { detail: { info, provider } = {} } = event

      // Retrieve wallet details from the event
      const { uuid } = info ?? {}

      // Verify that the wallet has the correct UUID and all required fields
      if (!uuid || !info || !uuidRegex.test(uuid)) return

      const unifiedWallet = createUnifiedWallet({
        wallet: {
          provider: (network) => new BrowserProvider(provider, undefined, { staticNetwork: network }),
          originalProvider: provider,
          info,
          type: WalletType.Ethereum,
          supports: {
            requestPermissions: info.rdns.startsWith("io.metamask"),
            disconnectMethod: info.rdns.startsWith("io.metamask")
          }
        },
        ignoreListRef: options.ignoreListRef,
        onUpdate
      })

      setWalletsList(uuid, unifiedWallet)
    } catch {
      return
    }
  }

  // @ts-ignore
  window.addEventListener("eip6963:announceProvider", handleAnnounceEvent)
  window.dispatchEvent(new Event("eip6963:requestProvider"))

  return () => Object.values(walletsList)
}
