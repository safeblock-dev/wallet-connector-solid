import { TonConnectUI } from "@tonconnect/ui"

/**
 * TON Connect wrapper
 *
 * @param provider TON Connect instance
 */
export default async function connectTon(provider: TonConnectUI) {
  if (provider.connected) {
    await provider.disconnect()
    return true
  }

  try {
    await provider.openModal()

    return await new Promise<boolean>(resolve => {
      provider.onModalStateChange(state => {
        if (state.status === "closed") {

          resolve(state.closeReason === "wallet-selected")
        }
      })
    })
  } catch {
    return false
  }
}
