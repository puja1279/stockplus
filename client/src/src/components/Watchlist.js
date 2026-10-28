import React, { useState } from "react";

const Watchlist = () => {
  const [stocks, setStocks] = useState(["TCS", "INFY", "RELIANCE"]);
  const [newStock, setNewStock] = useState("");

  const addStock = () => {
    if (newStock && !stocks.includes(newStock.toUpperCase())) {
      setStocks([...stocks, newStock.toUpperCase()]);
      setNewStock("");
    }
  };

  const removeStock = (symbol) => {
    setStocks(stocks.filter((s) => s !== symbol));
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>👀 My Watchlist</h2>
      <input
        type="text"
        value={newStock}
        placeholder="Add stock symbol (e.g. INFY)"
        onChange={(e) => setNewStock(e.target.value)}
      />
      <button onClick={addStock}>➕ Add</button>

      <ul>
        {stocks.map((symbol) => (
          <li key={symbol}>
            {symbol}{" "}
            <button onClick={() => removeStock(symbol)} style={{ color: "red" }}>
              ❌ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
