import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import MarketList from "./components/MarketList";
import AdminCreateMarkets from "./components/AdminCreateMarkets";
import Portfolio from "./components/Portfolio";
import Activity from "./components/Activity";

import { ADDRESSES } from "./constants/addresses";
import { useMarkets } from "./hooks/useMarkets";

import "./App.css";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Markets");

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { markets } = useMarkets();

  const isAdmin =
    address?.toLowerCase() === ADDRESSES.ADMIN.toLowerCase();

  const totalVolume = markets.reduce((acc, market) => {
    const value = Number(market.volume.replace(/[$,]/g, ""));
    return acc + value;
  }, 0);

  const categories = [
    "All",
    "Trending",
    "Crypto",
    "Arc",
    "Sports",
    "Politics",
    "Macro",
    "Tech & AI",
    "Culture",
    "Science",
  ];

  return (
    <main className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="logo">⚔</div>
          <div>
            <strong>PredictionMarket ARC</strong>
            <span>TESTNET</span>
          </div>
        </div>

        <div className="nav-tabs">
          {["Markets", "Portfolio", "Leaderboard", "Activity"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="wallet">
          <button className="balance">
            ${totalVolume.toLocaleString()} USDC
          </button>

          {isConnected ? (
            <button onClick={() => disconnect()} className="wallet-btn">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="wallet-btn"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>PredictionMarket ARC</h1>
          <h2>Predict. Trade. Win USDC.</h2>
          <p>Trade YES or NO with USDC on Arc Network testnet.</p>
        </div>

        <div className="stats">
          <div>
            <strong>${totalVolume.toLocaleString()}</strong>
            <span>Total Volume</span>
          </div>

          <div>
            <strong>{markets.length}</strong>
            <span>Open Markets</span>
          </div>

          <div>
            <strong>{markets.length * 8}</strong>
            <span>Traders</span>
          </div>
        </div>
      </section>

      <section className="top-movers">
        <p className="section-label">TOP MOVERS</p>

        <div className="mover-grid">
          {markets.slice(0, 4).map((market) => (
            <div className="mover-card" key={market.id}>
              <strong>{market.title}</strong>

              <div>
                <span>{market.yesPrice}</span>
                <b
                  className={
                    Number(market.yesPrice.replace("¢", "")) >= 50
                      ? "up"
                      : "down"
                  }
                >
                  {Number(market.yesPrice.replace("¢", "")) >= 50
                    ? "+5%"
                    : "-3%"}
                </b>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeTab === "Markets" && (
        <>
          <section className="filters">
            {categories.map((item) => (
              <button
                key={item}
                className={activeCategory === item ? "active" : ""}
                onClick={() => setActiveCategory(item)}
              >
                {item}
              </button>
            ))}

            <input placeholder="Search..." />
          </section>

          <MarketList activeCategory={activeCategory} />
        </>
      )}

      {activeTab === "Portfolio" && <Portfolio />}

      {activeTab === "Activity" && <Activity />}

      {activeTab === "Leaderboard" && (
        <div className="empty-text">Leaderboard coming soon.</div>
      )}

      {isAdmin && <AdminCreateMarkets />}
    </main>
  );
}