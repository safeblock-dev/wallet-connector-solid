import { UnifiedWalletDescriptor } from "../types/wallet"

// TODO: correct metadata
export const tronWalletDescriptors: UnifiedWalletDescriptor[] = [
  {
    uuid: "c7e2c1b2-5403-4d05-8b80-694cd1be59fe",
    provider: runtime => runtime.tronWeb,
    name: "TronLink",
    icon: ""
  }
]
