import { UnifiedWalletDescriptor } from "../types/wallet"

export const ethereumWalletDescriptors: UnifiedWalletDescriptor[] = [
  {
    name: "Phantom",
    icon: "https://assets.safeblock.com/wallets/phantom.png",
    uuid: "80ddb7cf-6879-4639-89a9-27dbf9528f61",
    provider: runtime => runtime.phantom.ethereum
  }
]
