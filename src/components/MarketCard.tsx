import { useState } from "react";
import { usePredictionMarket } from "../hooks/usePredictionMarket";
import type { OnchainMarket } from "../hooks/useMarkets";

export default function MarketCard({ market }: { market: OnchainMarket }) {
  const [amount, setAmount] = useState("1");
  const { buyYes, buyNo, claim, isPending } = usePredictionMarket();

  const yesNumber = Number(market.yesPrice.replace("¢", ""));

  const handleBuyYes = async () => {
    try {
      await buyYes(BigInt(market.id), amount);
      alert("Buy YES success");
    } catch (err) {
      console.error(err);
      alert("Buy YES failed");
    }
  };

  const handleBuyNo = async () => {
    try {
      await buyNo(BigInt(market.id), amount);
      alert("Buy NO success");
    } catch (err) {
      console.error(err);
      alert("Buy NO failed");
    }
  };

  const handleClaim = async () => {
    try {
      await claim(BigInt(market.id));
      alert("Claim success");
    } catch (err) {
      console.error(err);
      alert("Claim failed");
    }
  };

  return (
    <div className="market-card">
      <div className="card-header">
        <div className="market-logo">⚔</div>
        <span className="tag">{market.category}</span>
      </div>

      <h3>{market.title}</h3>

      <p className="market-id">ID #{market.id}</p>

      <div className="chance-row">
        <strong>{yesNumber}</strong>
        <span>% chance</span>
        <b className="spark">⌁⌁⌁</b>
        <em>{market.resolved ? market.status : "+5%"}</em>
      </div>

      <div className="bar">
        <div style={{ width: `${yesNumber}%` }} />
      </div>

      <div className="price-row">
        <span>YES {market.yesPrice}</span>
        <span>NO {market.noPrice}</span>
      </div>

      <div className="meta-row">
        <div>
          <span>Vol</span>
          <strong>{market.volume}</strong>
        </div>

        <div>
          <span>Ends</span>
          <strong>{market.endDate}</strong>
        </div>
      </div>

      <div className="pool-row">
        <div>
          <span>YES Pool</span>
          <strong>{market.yesAmount}</strong>
        </div>

        <div>
          <span>NO Pool</span>
          <strong>{market.noAmount}</strong>
        </div>
      </div>

      {!market.resolved && (
        <>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="USDC amount"
            className="amount-input"
          />

          <div className="trade-buttons">
            <button onClick={handleBuyYes} disabled={isPending || !amount}>
              YES {market.yesPrice}
            </button>

            <button onClick={handleBuyNo} disabled={isPending || !amount}>
              NO {market.noPrice}
            </button>
          </div>
        </>
      )}

      {market.resolved && (
        <button onClick={handleClaim} disabled={isPending} className="claim-btn">
          Claim Payout
        </button>
      )}
    </div>
  );
}