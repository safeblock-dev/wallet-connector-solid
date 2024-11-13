import { TonConnectUI } from "@tonconnect/ui"
import { UnifiedWalletDescriptor } from "../types/wallet"

// TODO: correct metadata
export const tonWalletDescriptors: UnifiedWalletDescriptor[] = [
  {
    uuid: "15b9297d-2814-4117-90c5-1994e7fbf778",
    provider: () => new TonConnectUI({
      manifestUrl: ""
    }),
    name: "TON Connect",
    icon: ""
  }
]
