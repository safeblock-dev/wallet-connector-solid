export interface WalletConfiguration {
  id: string
  deepLink: string
  universalLink: string
}

const walletConfig: WalletConfiguration[] = [
  {
    // MetaMask
    id: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    deepLink: "metamask://",
    universalLink: "metamask.app.link"
  },
  {
    // Zerion
    id: "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",
    deepLink: "zerion://",
    universalLink: "wallet.zerion.io/wc"
  },
  {
    // Rainbow
    id: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    deepLink: "rainbow://",
    universalLink: "rnbwapp.com"
  },
  {
    // Uniswap
    id: "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
    deepLink: "uniswap://",
    universalLink: "uniswap.org/app"
  },
  {
    // Binance
    id: "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
    deepLink: "bnc://app.binance.com/cedefi/",
    universalLink: "app.binance.com/cedefi"
  },
  {
    // SafePal
    id: "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",
    deepLink: "safepalwallet://",
    universalLink: "link.safepal.io"
  },
  {
    // 1inch
    id: "c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576",
    deepLink: "oneinch://",
    universalLink: "wallet.1inch.io"
  },
  {
    // Exodus
    id: "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4",
    deepLink: "exodus://",
    universalLink: "exodus.com/m"
  }
]

export default walletConfig
