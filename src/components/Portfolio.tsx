import { useAccount, useReadContracts } from "wagmi";
import { type Abi, formatUnits } from "viem";

import { useMarkets } from "../hooks/useMarkets";
import { ADDRESSES } from "../constants/addresses";
import PredictionMarketABIJson from "../constants/abis/PredictionMarketABI.json";

const PredictionMarketABI = PredictionMarketABIJson as Abi;

export default function Portfolio() {
  const { address } = useAccount();
  const { markets } = useMarkets();

  const contracts = markets.flatMap((market) => {
    const yesTokenId = BigInt(market.id * 2 - 1);
    const noTokenId = BigInt(market.id * 2);

    return [
      {
        address: ADDRESSES.POSITION_TOKEN,
        abi: PredictionMarketABI,
        functionName: "balanceOf",
        args: [address, yesTokenId],
      },
      {
        address: ADDRESSES.POSITION_TOKEN,
        abi: PredictionMarketABI,
        functionName: "balanceOf",
        args: [address, noTokenId],
      },
    ];
  });

  const { data } = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(address) && markets.length > 0,
      refetchInterval: 3000,
    },
  });

  if (!address) {
    return <div className="empty-text">Connect wallet để xem Portfolio.</div>;
  }

  const positions = markets.map((market, index) => {
    const yesBalance = data?.[index * 2]?.result as bigint | undefined;
    const noBalance = data?.[index * 2 + 1]?.result as bigint | undefined;

    return {
      market,
      yesBalance: yesBalance ?? 0n,
      noBalance: noBalance ?? 0n,
    };
  });

  const visible = positions.filter(
    (p) => p.yesBalance > 0n || p.noBalance > 0n
  );

  if (visible.length === 0) {
    return <div className="empty-text">Ví này chưa có vị thế YES/NO.</div>;
  }

  return (
    <div className="portfolio-grid">
      {visible.map(({ market, yesBalance, noBalance }) => (
        <div className="portfolio-card" key={market.id}>
          <span className="tag">{market.category}</span>

          <h3>{market.title}</h3>

          <p className="market-id">ID #{market.id}</p>

          <div className="portfolio-row">
            <span>YES Position</span>
            <strong>{formatUnits(yesBalance, 6)} YES</strong>
          </div>

          <div className="portfolio-row">
            <span>NO Position</span>
            <strong>{formatUnits(noBalance, 6)} NO</strong>
          </div>

          <div className="portfolio-row">
            <span>Status</span>
            <strong>{market.status}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}