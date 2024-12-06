import { TonConnectUI } from "@tonconnect/ui"
import { UnifiedWalletDescriptor } from "../types/wallet"

export const tonWalletDescriptors: UnifiedWalletDescriptor[] = [
  {
    uuid: "15b9297d-2814-4117-90c5-1994e7fbf778",
    provider: () => new TonConnectUI({
      manifestUrl: "https://github.com/safeblock-dev/wallet-connector-solid/blob/main/public/ton-connect.manifest.json"
    }),
    name: "TON Connect",
    icon: "https://raw.githubusercontent.com/safeblock-dev/wallet-connector-solid/refs/heads/main/public/icons/tonconnect.png"
  }
]
