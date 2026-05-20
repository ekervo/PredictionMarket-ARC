import { useState } from "react";
import { usePredictionMarket } from "../hooks/usePredictionMarket";
import type { OnchainMarket } from "../hooks/useMarkets";

function getMarketIcon(category: string) {
  switch (category) {
    case "Sports":
      return "🏆";
    case "Crypto":
      return "₿";
    case "Politics":
      return "🏛";
    case "Tech & AI":
      return "🤖";
    case "Trending":
      return "🔥";
    case "Macro":
      return "📈";
    case "Culture":
      return "🎬";
    case "Science":
      return "🧪";
    case "Arc":
      return "⚡";
    default:
      return "◇";
  }
}

export default function MarketCard({ market }: { market: OnchainMarket }) {
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const { buyYes, buyNo, claim, isPending } = usePredictionMarket();

  const yesNumber = Number(market.yesPrice.replace("¢", ""));
  const marketIcon = getMarketIcon(market.category);

  const showMessage = (text: string, hash?: string) => {
    setMessage(text);
    setTxHash(hash ?? "");

    setTimeout(() => {
      setMessage("");
      setTxHash("");
    }, 6000);
  };

  const handleBuyYes = async () => {
    try {
      const receipt: any = await buyYes(BigInt(market.id), amount);
      showMessage(
        "YES position purchased successfully",
        receipt?.transactionHash
      );
    } catch (err) {
      console.error(err);
      showMessage("YES purchase failed");
    }
  };

  const handleBuyNo = async () => {
    try {
      const receipt: any = await buyNo(BigInt(market.id), amount);
      showMessage(
        "NO position purchased successfully",
        receipt?.transactionHash
      );
    } catch (err) {
      console.error(err);
      showMessage("NO purchase failed");
    }
  };

  const handleClaim = async () => {
    try {
      const receipt: any = await claim(BigInt(market.id));
      showMessage(
        "Payout claimed successfully",
        receipt?.transactionHash
      );
    } catch (err) {
      console.error(err);
      showMessage("Claim failed");
    }
  };

  return (
    <>
      {message && (
        <div className="success-toast">
          <div className="toast-icon">✓</div>

          <div>
            <strong>{message}</strong>

            {txHash && (
              <a
                href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="tx-link"
              >
                View transaction on ArcScan ↗
              </a>
            )}
          </div>
        </div>
      )}

      <div className="market-card">
        <div className="card-header">
          <div className="market-logo">{marketIcon}</div>
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
          <button
            onClick={handleClaim}
            disabled={isPending}
            className="claim-btn"
          >
            Claim Payout
          </button>
        )}
      </div>
    </>
  );
}