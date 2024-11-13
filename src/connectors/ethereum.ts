import { BrowserProvider } from "ethers"
import bewareExceptions from "../beware-exceptions"

/**
 * Connector for ethereum inpage provider
 *
 * @param provider inpage provider reference
 */
export default async function connectInpageEthereum(provider: BrowserProvider) {
  // Skip if already connecting

  // Check if this wallet is already connected to the dApp
  const accountConnected = (await provider.listAccounts()).length !== 0

  // Call relative wallet method
  const result = await bewareExceptions(() => provider.send(
    accountConnected ? "wallet_requestPermissions" : "eth_requestAccounts",
    accountConnected ? [{ eth_accounts: {} }] : []
  ))

  return result !== null
}
