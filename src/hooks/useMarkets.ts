import { formatUnits, type Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

import PredictionMarketABIJson from "../constants/abis/PredictionMarketABI.json";
import { ADDRESSES } from "../constants/addresses";

const PredictionMarketABI = PredictionMarketABIJson as Abi;

export type OnchainMarket = {
  id: number;
  title: string;
  category: string;
  volume: string;
  endDate: string;
  yesPrice: string;
  noPrice: string;
  yesAmount: string;
  noAmount: string;
  status: string;
  resolved: boolean;
  outcome: boolean;
};

function formatUSDC(value: bigint) {
  const num = Number(formatUnits(value, 6));

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

function formatDate(timestamp: bigint) {
  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategory(title: string) {
  const t = title.toLowerCase();

  if (
    t.includes("btc") ||
    t.includes("bitcoin") ||
    t.includes("eth") ||
    t.includes("ethereum") ||
    t.includes("sol") ||
    t.includes("crypto")
  ) {
    return "Crypto";
  }

  if (
    t.includes("trump") ||
    t.includes("president") ||
    t.includes("election")
  ) {
    return "Politics";
  }

  if (
    t.includes("fifa") ||
    t.includes("world cup") ||
    t.includes("nba") ||
    t.includes("neymar")
  ) {
    return "Sports";
  }

  if (
    t.includes("fed") ||
    t.includes("interest") ||
    t.includes("oil") ||
    t.includes("rate") ||
    t.includes("recession")
  ) {
    return "Macro";
  }

  if (
    t.includes("openai") ||
    t.includes("gpt") ||
    t.includes("nvidia") ||
    t.includes("tesla") ||
    t.includes("apple") ||
    t.includes("ai")
  ) {
    return "Tech & AI";
  }

  if (t.includes("arc") || t.includes("arcium")) {
    return "Arc";
  }

  return "Trending";
}

export function useMarkets() {
  const { data: marketCountData, isLoading: isLoadingCount } =
    useReadContract({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "marketCount",
      query: {
        refetchInterval: 3000,
      },
    });

  const marketCount = Number(marketCountData ?? 0);

  const marketIds = Array.from(
    { length: marketCount },
    (_, index) => marketCount - index
  );

  const { data, isLoading: isLoadingMarkets, refetch } = useReadContracts({
    contracts: marketIds.map((id) => ({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "markets",
      args: [BigInt(id)],
    })),
    query: {
      enabled: marketCount > 0,
      refetchInterval: 3000,
    },
  });

  const markets =
    data
      ?.map((item, index) => {
        if (item.status !== "success") return null;

        const raw = item.result as any;
        const id = marketIds[index];

        const title = raw[0] as string;
        const endTime = raw[1] as bigint;
        const yesPool = raw[2] as bigint;
        const noPool = raw[3] as bigint;
        const resolved = raw[4] as boolean;
        const outcome = raw[5] as boolean;
        const exists = raw[6] as boolean;

        if (!exists) return null;

        const totalPool = yesPool + noPool;

        const yesPercent =
          totalPool > 0n
            ? Math.round((Number(yesPool) / Number(totalPool)) * 100)
            : 50;

        const noPercent = 100 - yesPercent;

        return {
          id,
          title,
          category: getCategory(title),
          volume: formatUSDC(totalPool),
          endDate: formatDate(endTime),
          yesPrice: `${yesPercent}¢`,
          noPrice: `${noPercent}¢`,
          yesAmount: formatUSDC(yesPool),
          noAmount: formatUSDC(noPool),
          resolved,
          outcome,
          status: resolved ? (outcome ? "YES Won" : "NO Won") : "Active",
        };
      })
      .filter(Boolean) as OnchainMarket[] || [];

  return {
    markets,
    marketCount,
    isLoading: isLoadingCount || isLoadingMarkets,
    refetch,
  };
}