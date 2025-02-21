import { BrowserProvider, JsonRpcSigner } from "ethers"
import cast from "../../cast"
import { IgnoreListRef } from "../../types/ignore-list"
import { UnifiedWallet } from "../../types/wallet"

/** Connected EVM account details */
export type EthereumAccountDetails = {
  /** Account signer instance */
  signer: JsonRpcSigner

  /** Account address, similar to the signer address */
  address: string

  /** Wallet details object link */
  wallet: UnifiedWallet
}

interface DetectEthereumAccountsOptions {
  wallets: UnifiedWallet[]
  accounts: EthereumAccountDetails[]
  setAccounts: (update: (current: EthereumAccountDetails[]) => EthereumAccountDetails[]) => any
  ignoreListRef?: IgnoreListRef
}

/**
 * Detect connected EVM accounts
 *
 * @param options detector options
 */
export default function detectEthereumAccounts(options: DetectEthereumAccountsOptions) {
  const { ignoreListRef, accounts, setAccounts, wallets } = options

  const updateAccounts = async () => {
    let list = [...wallets]

    const allConnectedAddresses: EthereumAccountDetails[] = []

    for (const walletDetails of list) {
      // If wallet connect provider not connected .listAccounts() will cause exception
      if (walletDetails.walletConnectProvider) {
        if (walletDetails.walletConnectProvider.accounts.length < 1) continue
      }

      if (ignoreListRef?.has(walletDetails.info.uuid)) continue

      const netCheckResponse = await cast<BrowserProvider>(walletDetails.provider())._detectNetwork().catch(() => false)

      if (netCheckResponse === false) ignoreListRef?.add(walletDetails.info.uuid)
      if (!netCheckResponse) continue
      // Get all signers of a specific wallet

      const signers = await cast<BrowserProvider>(walletDetails.provider()).listAccounts()
      allConnectedAddresses.push(...signers.map(signer => (
        { signer, address: signer.address, wallet: walletDetails }
      )))
    }

    setAccounts(current => {
      if (
        current.length === allConnectedAddresses.length &&
        current.every((c, i) => c.address === allConnectedAddresses[i].address && c.wallet.info.uuid === allConnectedAddresses[i].wallet.info.uuid)
      ) return current

      return allConnectedAddresses
    })
  }

  return {
    /** Get a reactive list of all connected accounts */
    updateAccounts,

    /** List all detected accounts */
    get list() {
      return accounts
    },

    /** Get a reactive list of accounts connected with a specified wallet */
    ofWallet(walletOrUUID: string | UnifiedWallet) {
      return accounts.filter(account => account.wallet.equalTo(walletOrUUID))
    }
  }
}
