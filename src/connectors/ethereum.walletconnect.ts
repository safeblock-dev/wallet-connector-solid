import EthereumProvider from "@walletconnect/ethereum-provider"

/**
 * WalletConnect provider connector
 * @param provider WalletConnect Ethereum-compatible provider reference
 */
export default async function connectWalletconnect(provider: EthereumProvider) {
  try {
    await provider.connect()
  } catch {
    return false
  }

  return true
}
