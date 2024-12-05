import { SetStoreFunction } from "solid-js/store"
import { BrowserProvider, JsonRpcSigner } from "ethers"
import { UnifiedWallet } from "../../types/wallet"
import cast from "../../cast"

/** Connected EVM account details */
type EthereumAccountDetails = {
  /** Account signer instance */
  signer: JsonRpcSigner

  /** Account address, similar to the signer address */
  address: string

  /** Wallet details object link */
  wallet: UnifiedWallet
}

/**
 * Detect connected EVM accounts
 *
 * @param wallets list of wallets to detect
 * @param accounts
 * @param setAccounts
 */
export default function detectEthereumAccounts(
  wallets: () => UnifiedWallet[],
  accounts: EthereumAccountDetails[],
  setAccounts: SetStoreFunction<EthereumAccountDetails[]>
) {

  const updateAccounts = async () => {
    let list = wallets()

    const allConnectedAddresses: EthereumAccountDetails[] = []

    for (const walletDetails of list) {
      // If wallet connect provider not connected .listAccounts() will cause exception
      if (walletDetails.walletConnectProvider) {
        if (walletDetails.walletConnectProvider.accounts.length < 1) continue
      }

      // Get all signers of a specific wallet
      const signers = await cast<BrowserProvider>(walletDetails.provider).listAccounts()

      allConnectedAddresses.push(...signers.map(signer => (
        { signer, address: signer.address, wallet: walletDetails }
      )))
    }

    setAccounts(allConnectedAddresses)
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
