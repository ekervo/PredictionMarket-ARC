import { useState } from "react";
import { useMarkets } from "../hooks/useMarkets";
import { usePredictionMarket } from "../hooks/usePredictionMarket";

export default function AdminCreateMarkets() {
  const [title, setTitle] = useState("");
  const [marketId, setMarketId] = useState("");

  const { refetch } = useMarkets();
  const { createMarket, resolveMarket, isPending } = usePredictionMarket();

  const handleCreateMarket = async () => {
    try {
      if (!title.trim()) return alert("Nhập title market");

      await createMarket(title);
      await refetch();

      setTitle("");
      alert("Create market success");
    } catch (err) {
      console.error(err);
      alert("Create market failed. Kiểm tra ví owner.");
    }
  };

  const handleResolve = async (outcome: boolean) => {
    try {
      if (!marketId) return alert("Nhập Market ID cho admin resolve");

      await resolveMarket(BigInt(marketId), outcome);
      alert("Resolve success");
    } catch (err) {
      console.error(err);
      alert("Resolve failed. Kiểm tra ví owner.");
    }
  };

  return (
    <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <div className="mt-6">
        <h3 className="font-bold">Create Market</h3>

        <input
          type="text"
          placeholder="VD: BTC có vượt $100,000 trong tháng này không?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-3 w-full rounded-xl border px-4 py-3"
        />

        <button
          onClick={handleCreateMarket}
          disabled={isPending}
          className="mt-3 rounded-xl bg-black px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          Create Market
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-bold">Resolve Market</h3>

        <input
          type="number"
          placeholder="Market ID chỉ dành cho admin"
          value={marketId}
          onChange={(e) => setMarketId(e.target.value)}
          className="mt-3 w-full rounded-xl border px-4 py-3"
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResolve(true)}
            disabled={isPending}
            className="rounded-xl bg-green-600 py-3 font-bold text-white disabled:opacity-50"
          >
            Resolve YES
          </button>

          <button
            onClick={() => handleResolve(false)}
            disabled={isPending}
            className="rounded-xl bg-red-600 py-3 font-bold text-white disabled:opacity-50"
          >
            Resolve NO
          </button>
        </div>
      </div>
    </div>
  );
}