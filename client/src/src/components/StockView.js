import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./StockView.css";

const StockView = () => {
  const { id } = useParams();
  const chartRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState((Math.random() * 1000 + 500).toFixed(2)); // Dummy price

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: `NSE:${id}`,
          container_id: "tradingview-chart",
          width: "100%",
          height: 500,
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: false,
        });
      }
    };
    chartRef.current.appendChild(script);
  }, [id]);

  const handleBuy = () => {
    alert(`Bought ${quantity} shares of ${id} at ₹${price}`);
  };

  const handleSell = () => {
    alert(`Sold ${quantity} shares of ${id} at ₹${price}`);
  };

  return (
    <div className="stockview-container">
      <h1 className="stock-name">{id} Stock Chart</h1>
      <div id="tradingview-chart" ref={chartRef}></div>

      <div className="trade-panel">
        <p>Current Price: ₹{price}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
        <div className="trade-buttons">
          <button className="buy-btn" onClick={handleBuy}>Buy</button>
          <button className="sell-btn" onClick={handleSell}>Sell</button>
        </div>
      </div>
    </div>
  );
};

export default StockView;
