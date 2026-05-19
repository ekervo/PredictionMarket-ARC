import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  type Abi,
  decodeEventLog,
  formatUnits,
} from "viem";

import { ADDRESSES } from "../constants/addresses";
import PredictionMarketABIJson from "../constants/abis/PredictionMarketABI.json";

const PredictionMarketABI =
  PredictionMarketABIJson as Abi;

type ActivityItem = {
  type: string;
  marketId: string;
  amount: string;
  tx: string;
};

export default function Activity() {
  const { address } = useAccount();

  const publicClient = usePublicClient();

  const [items, setItems] = useState<
    ActivityItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        if (!address || !publicClient) {
          setLoading(false);
          return;
        }

        const logs =
          await publicClient.getLogs({
            address:
              ADDRESSES.ROUTER as `0x${string}`,
            fromBlock: 0n,
            toBlock: "latest",
          });

        const parsed: ActivityItem[] = [];

        for (const log of logs) {
          try {
            const decoded = decodeEventLog({
              abi: PredictionMarketABI,
              data: log.data,
              topics: log.topics,
            });

            const args: any = decoded.args;

            if (
              args?.user?.toLowerCase?.() !==
              address.toLowerCase()
            ) {
              continue;
            }

            if (
              decoded.eventName ===
                "BoughtYes" ||
              decoded.eventName ===
                "BoughtNo" ||
              decoded.eventName ===
                "Claimed"
            ) {
              parsed.push({
                type: decoded.eventName,
                marketId:
                  args.marketId?.toString?.() ??
                  "-",
                amount: formatUnits(
                  args.amount ??
                    args.payout ??
                    0n,
                  6
                ),
                tx:
                  log.transactionHash ?? "",
              });
            }
          } catch {
            continue;
          }
        }

        setItems(parsed.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, [address, publicClient]);

  if (!address) {
    return (
      <div className="empty-text">
        Connect wallet để xem Activity.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-text">
        Loading activity...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-text">
        Ví này chưa có hoạt động.
      </div>
    );
  }

  return (
    <div className="activity-list">
      {items.map((item, index) => (
        <div
          className="activity-card"
          key={`${item.tx}-${index}`}
        >
          <strong>{item.type}</strong>

          <span>
            Market #{item.marketId}
          </span>

          <span>
            {item.amount} USDC
          </span>

          <small>
            {item.tx.slice(0, 10)}...
            {item.tx.slice(-6)}
          </small>
        </div>
      ))}
    </div>
  );
}