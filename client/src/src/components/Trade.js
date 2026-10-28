import React, { useState } from "react";
import axios from "axios";

function Trade() {
  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);

  const token = localStorage.getItem("token");

  const handleBuy = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/trade/buy",
        { stockSymbol, quantity: Number(quantity), price: Number(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolio(res.data.portfolio);
      setBalance(res.data.balance);
      alert("✅ Stock Bought!");
    } catch (err) {
      alert(err.response?.data?.error || "Error in buy");
    }
  };

  const handleSell = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/trade/sell",
        { stockSymbol, quantity: Number(quantity), price: Number(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolio(res.data.portfolio);
      setBalance(res.data.balance);
      alert("✅ Stock Sold!");
    } catch (err) {
      alert(err.response?.data?.error || "Error in sell");
    }
  };

  return (
    <div>
      <h2>📈 Trade Stocks</h2>
      <p>💰 Balance: ₹{balance}</p>

      <input
        type="text"
        placeholder="Stock Symbol"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleBuy}>Buy</button>
      <button onClick={handleSell}>Sell</button>

      <h3>📊 Portfolio</h3>
      <ul>
        {portfolio.map((stock, idx) => (
          <li key={idx}>
            {stock.stockSymbol} - {stock.quantity} shares @ ₹
            {stock.avgPrice.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trade;
