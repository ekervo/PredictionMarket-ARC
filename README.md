# PredictionMarket ARC

A decentralized prediction market built on Arc Network Testnet using USDC collateral and ERC1155 position tokens.

---

# Features

* YES / NO prediction trading
* ERC1155 position tokens
* USDC collateral pools
* Portfolio tracking
* On-chain activity feed
* Admin market resolution
* Arc EVM compatible
* Real-time pool volume tracking

---

# Tech stack

## Frontend

```txt
React
TypeScript
Vite
Wagmi
Viem
```

## Smart contracts

```txt
Solidity
OpenZeppelin
ERC1155
Ownable
ReentrancyGuard
```

## Blockchain

```txt
Arc Network Testnet
```

---

# Project structure

```txt
predictionmarket-arc/
├── public/
├── src/
│
├── components/
│   ├── Activity.tsx
│   ├── AdminCreateMarkets.tsx
│   ├── ConnectWalletButton.tsx
│   ├── CreateMarketForm.tsx
│   ├── MarketCard.tsx
│   ├── MarketList.tsx
│   └── Portfolio.tsx
│
├── config/
│   ├── arcTestnet.ts
│   └── wagmiConfig.ts
│
├── constants/
│   ├── abis/
│   │   ├── ERC20ABI.json
│   │   ├── ERC1155ABI.json
│   │   └── PredictionMarketABI.json
│   │
│   └── addresses.ts
│
├── hooks/
│   ├── useMarkets.ts
│   └── usePredictionMarket.ts
│
├── App.tsx
├── App.css
├── main.tsx
│
├── .env
├── package.json
└── README.md
```

---

# Market workflow

```txt
Admin creates market
↓
Users buy YES / NO using USDC
↓
USDC added into liquidity pools
↓
ERC1155 position tokens minted
↓
Admin resolves market
↓
Winning users claim payouts
```

---

# ERC1155 position system

Each market generates two ERC1155 tokens:

| Position | Token ID         |
| -------- | ---------------- |
| YES      | marketId * 2 - 1 |
| NO       | marketId * 2     |

Example:

```txt
Market #1
YES token = ID 1
NO token = ID 2

Market #2
YES token = ID 3
NO token = ID 4
```

---

# Core smart contract functions

## Create market

```solidity
createMarket(
    string title,
    uint256 endTime
)
```

## Buy YES

```solidity
buyYes(
    uint256 marketId,
    uint256 amount
)
```

## Buy NO

```solidity
buyNo(
    uint256 marketId,
    uint256 amount
)
```

## Resolve market

```solidity
resolveMarket(
    uint256 marketId,
    bool outcome
)
```

## Claim payout

```solidity
claim(
    uint256 marketId
)
```

---

# Portfolio system

The Portfolio tab reads real ERC1155 balances:

```txt
balanceOf(wallet, tokenId)
```

Users can track:

* YES positions
* NO positions
* Resolved markets
* Claimable markets

---

# Activity feed

The Activity page reads real blockchain events:

```txt
BoughtYes
BoughtNo
Claimed
```

using:

```txt
decodeEventLog()
```

---

# Security

## Protected admin functions

```solidity
onlyOwner
```

used for:

```txt
createMarket()
resolveMarket()
```

## Additional protections

```txt
ReentrancyGuard
ERC1155 balance validation
USDC transfer verification
On-chain settlement
```

---

# Deployment

## GitHub

```bash
git init
git add .
git commit -m "PredictionMarket ARC"
```

## Vercel

```bash
npm run build
```

Deploy using:

```txt
Framework: Vite
Output directory: dist
```

---

# Future upgrades

```txt
AMM pricing engine
Dynamic odds
Leaderboard system
Secondary trading
Liquidity pools
Charts & analytics
Cross-chain support
Mobile app
```

---

# Disclaimer

PredictionMarket ARC is currently deployed on testnet for educational and experimental purposes only.

Do not use real funds.
