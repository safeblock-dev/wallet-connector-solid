import { BrowserProvider } from "ethers"
import bewareExceptions from "../beware-exceptions"

/**
 * Connector for ethereum inpage provider
 *
 * @param provider inpage provider reference
 */
export default async function connectInpageEthereum(provider: BrowserProvider) {
  // Skip if already connecting

  const list = await provider.listAccounts().catch(() => null)
  if (!list || !Array.isArray(list)) return false

  // Check if this wallet is already connected to the dApp
  const accountConnected = list.length !== 0

  // Call relative wallet method
  const result = await bewareExceptions(() => provider.send(
    accountConnected ? "wallet_requestPermissions" : "eth_requestAccounts",
    accountConnected ? [{ eth_accounts: {} }] : []
  ))

  return result !== null
}
