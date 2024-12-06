import { UnifiedWalletDescriptor } from "../types/wallet"

export const ethereumWalletDescriptors: UnifiedWalletDescriptor[] = [
  {
    name: "Phantom",
    icon: "https://raw.githubusercontent.com/safeblock-dev/wallet-connector-solid/refs/heads/main/public/icons/phantom.png",
    uuid: "80ddb7cf-6879-4639-89a9-27dbf9528f61",
    provider: runtime => runtime.phantom.ethereum
  }
]
