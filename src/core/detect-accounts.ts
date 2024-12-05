import { UnifiedWallet } from "../types/wallet"
import cast from "../cast"


interface SimpleAccountDetails {
  address: string

  wallet: UnifiedWallet
}

export default function detectAccounts<P = any>(
  wallets: () => UnifiedWallet[],
  getAddress: (provider: P) => string | undefined | null | false,
  accounts: SimpleAccountDetails[],
  setAccounts: (update: SimpleAccountDetails[]) => any
) {
  let interval = setInterval(() => {
    const allConnectedAccounts: SimpleAccountDetails[] = []

    wallets().forEach(wallet => {
      const address = getAddress(cast<any>(wallet.provider)) || null

      if (!address) return

      allConnectedAccounts.push({
        wallet,
        address
      })
    })

    setAccounts(allConnectedAccounts)
  }, 100)

  return {
    get list() {
      return accounts
    },

    interval,

    // Get a reactive list of accounts connected with a specified wallet
    ofWallet(walletOrUUID: string | UnifiedWallet) {
      return accounts.filter(account => account.wallet.equalTo(walletOrUUID))
    }
  }
}
