/** Installed wallet info (eip6963-compatible only) */
export type EthereumWalletInfo = {
  name: string
  icon: string
  rdns: string
  uuid: string
  multiAccount: boolean
}

/** eip6963 announce provider event */
export type Eip6963AnnounceEvent = Event & {
  detail: { provider: any, info: EthereumWalletInfo }
}
