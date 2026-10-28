// src/pages/StockDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TradingChart from "../components/TradingChart";
import BuySell from "../components/BuySell";

export default function StockDetailPage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stocks/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          setStockData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const handleBuy = (order) => {
    console.log("BUY:", order);
    // येथे API call करा
  };

  const handleSell = (order) => {
    console.log("SELL:", order);
    // येथे API call करा
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>
        {stockData ? `${stockData.symbol} - ${stockData.name}` : symbol} • Chart & Trade
      </h2>

      {/* Chart */}
      <TradingChart symbol={symbol} />

      {/* Buy/Sell panel */}
      <BuySell 
        symbol={symbol} 
        onBuy={handleBuy} 
        onSell={handleSell} 
        currentPrice={stockData?.price}
      />
    </div>
  );
}