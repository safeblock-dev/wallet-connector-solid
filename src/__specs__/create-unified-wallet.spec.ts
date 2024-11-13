import createUnifiedWallet from "../core/create-unified-wallet"
import { UnifiedWalletMetadata, WalletType } from "../types/wallet"

describe("Utils / Core / CreateUnifiedWallet", () => {
  const mockProviderA = Symbol("A") as any
  const mockProviderB = Symbol("B") as any

  const mockData: UnifiedWalletMetadata = {
    type: WalletType.Tron,
    provider: mockProviderA,
    info: {
      uuid: "1",
      icon: "",
      name: "WalletA"
    },
    supports: {
      requestPermissions: false
    }
  }

  const unifiedWalletA = createUnifiedWallet(mockData)
  const unifiedWalletB = createUnifiedWallet({
    ...mockData,
    provider: mockProviderB
  })

  it("should return correct UnifiedWallet description object", () => {
    expect(unifiedWalletA).toHaveProperty("equalTo")
    expect(unifiedWalletA).toHaveProperty("connect")
    expect(unifiedWalletA).toHaveProperty("disconnect")
  })

  it("should return previously created wallet from cache", () => {
    expect(unifiedWalletB.provider).toEqual(mockProviderA)
  })
})
