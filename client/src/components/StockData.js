import React, { useState } from "react";
import axios from "axios";

function StockData() {
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);

  const getStock = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      setStock(res.data);
    } catch (err) {
      alert("Error fetching stock data");
    }
  };

  return (
    <div>
      <h2>📈 Stock Data</h2>
      <input
        type="text"
        placeholder="Enter Symbol (eg: RELIANCE.NS)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={getStock}>Get Data</button>

      {stock && (
        <div>
          <h3>{stock.name} ({stock.symbol})</h3>
          <p>💰 Price: ₹{stock.price}</p>
          <p>
            📉 Change: {stock.change} ({stock.percentChange.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
}

export default StockData;
