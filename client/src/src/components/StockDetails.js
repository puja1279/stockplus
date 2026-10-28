// src/pages/StockDetailPage.js
import React from "react";
import { useParams } from "react-router-dom";
import TradingChart from "../components/TradingChart";
import BuySell from "../components/BuySell";

export default function StockDetailPage() {
  const { symbol } = useParams(); // उदाहरण: /stock/NSE:TCS

  // सध्या demo handlers — पुढे backend API शी जोडू.
  const handleBuy = (order) => {
    console.log("BUY:", order);
    alert(`BUY placed: ${order.symbol} x ${order.qty} (${order.type}${order.price ? " @ " + order.price : ""})`);
  };
  const handleSell = (order) => {
    console.log("SELL:", order);
    alert(`SELL placed: ${order.symbol} x ${order.qty} (${order.type}${order.price ? " @ " + order.price : ""})`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>{symbol} • Chart & Trade</h2>

      {/* Chart */}
      <TradingChart symbol={symbol} />

      {/* Buy/Sell panel */}
      <BuySell symbol={symbol} onBuy={handleBuy} onSell={handleSell} />
    </div>
  );
}
