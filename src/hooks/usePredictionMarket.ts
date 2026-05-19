import {
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { parseUnits, type Abi } from "viem";

import PredictionMarketABIJson from "../constants/abis/PredictionMarketABI.json";
import ERC20ABIJson from "../constants/abis/ERC20ABI.json";
import { ADDRESSES } from "../constants/addresses";

const PredictionMarketABI = PredictionMarketABIJson as Abi;
const ERC20ABI = ERC20ABIJson as Abi;

export function usePredictionMarket() {
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending, error } = useWriteContract();

  const waitTx = async (hash: `0x${string}`) => {
    return publicClient?.waitForTransactionReceipt({ hash });
  };

  const createMarket = async (title: string) => {
    const hash = await writeContractAsync({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "createMarket",
      args: [title],
    });

    return waitTx(hash);
  };

  const approveUSDC = async (amount: string) => {
    const parsedAmount = parseUnits(amount, 6);

    const hash = await writeContractAsync({
      address: ADDRESSES.USDC as `0x${string}`,
      abi: ERC20ABI,
      functionName: "approve",
      args: [ADDRESSES.ROUTER, parsedAmount],
    });

    return waitTx(hash);
  };

  const buyYes = async (marketId: bigint, amount: string) => {
    const parsedAmount = parseUnits(amount, 6);

    await approveUSDC(amount);

    const hash = await writeContractAsync({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "buyYes",
      args: [marketId, parsedAmount],
    });

    return waitTx(hash);
  };

  const buyNo = async (marketId: bigint, amount: string) => {
    const parsedAmount = parseUnits(amount, 6);

    await approveUSDC(amount);

    const hash = await writeContractAsync({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "buyNo",
      args: [marketId, parsedAmount],
    });

    return waitTx(hash);
  };

  const claim = async (marketId: bigint) => {
    const hash = await writeContractAsync({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "claim",
      args: [marketId],
    });

    return waitTx(hash);
  };

  const resolveMarket = async (marketId: bigint, outcome: boolean) => {
    const hash = await writeContractAsync({
      address: ADDRESSES.ROUTER,
      abi: PredictionMarketABI,
      functionName: "resolveMarket",
      args: [marketId, outcome],
    });

    return waitTx(hash);
  };

  return {
    createMarket,
    approveUSDC,
    buyYes,
    buyNo,
    claim,
    resolveMarket,
    isPending,
    error,
  };
}

export function usePositionBalance(
  address: `0x${string}` | undefined,
  tokenId: bigint
) {
  return useReadContract({
    address: ADDRESSES.POSITION_TOKEN,
    abi: PredictionMarketABI,
    functionName: "balanceOf",
    args: address ? [address, tokenId] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });
}