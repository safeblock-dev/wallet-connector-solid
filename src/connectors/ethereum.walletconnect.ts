import EthereumProvider from "@walletconnect/ethereum-provider"
import { ConnectOps } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider"

/**
 * WalletConnect provider connector
 * @param provider WalletConnect Ethereum-compatible provider reference
 * @param opts WC connection options
 */
export default async function connectWalletConnect(provider: EthereumProvider, opts?: ConnectOps) {
  try {
    await provider.connect(opts)
  } catch {
    return false
  }

  return true
}
