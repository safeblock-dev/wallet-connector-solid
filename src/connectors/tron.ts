/**
 * Tron inpage provider connector
 *
 * @param provider TronWeb reference
 */
export default async function connectInpageTron(provider: any) {
  try {
    await provider.request({ method: "tron_requestAccounts" })
  } catch {
    return false
  }

  return true
}
