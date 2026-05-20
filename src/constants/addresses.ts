export const ADDRESSES = {
  USDC: "0x3600000000000000000000000000000000000000",

  ROUTER: "0x8FE4e37Cdc1AEDB356d3ECD3A750b582Ac0664CD",

  POSITION_TOKEN: "0x8FE4e37Cdc1AEDB356d3ECD3A750b582Ac0664CD",

  // Thay bằng ví owner/admin của contract
  ADMIN: "0xE78741C2764c47Fb6224b86e30f26D1a9F6115Ba",
} as const;

export const PREDICTION_MARKET_ADDRESS = ADDRESSES.ROUTER;

export const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
} as const;