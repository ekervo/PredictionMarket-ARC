import { useState } from "react";
import { usePredictionMarket } from "../hooks/usePredictionMarket";

export default function CreateMarketForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { createMarket } = usePredictionMarket();

  const handleCreateMarket = async () => {
    if (!title.trim()) {
      setMessage("Please enter a market title.");
      return;
    }

    try {
      setMessage("Confirm in wallet...");
      await createMarket(title);
      setMessage("Market created successfully.");
      setTitle("");
    } catch {
      setMessage("Market creation failed.");
    }
  };

  return (
    <section className="create-card">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Will Bitcoin exceed $100,000 this month?"
      />

      <button onClick={handleCreateMarket}>+ Create Market</button>

      {message && <span>{message}</span>}
    </section>
  );
}