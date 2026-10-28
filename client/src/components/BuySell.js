import React, { useState, useEffect } from "react";

const BuySell = () => {
  const [marketPrice, setMarketPrice] = useState(100); // Starting fake price
  const [balance, setBalance] = useState(10000); // Starting ₹10k
  const [position, setPosition] = useState(null); // Current position { type, qty, entryPrice }
  const [pnl, setPnl] = useState(0);

  // Fake market price change every 2 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrice((prev) => {
        const change = (Math.random() - 0.5) * 2; // Price +/- 1
        return +(prev + change).toFixed(2);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update P&L if position exists
  useEffect(() => {
    if (position) {
      let profitLoss = 0;
      if (position.type === "LONG") {
        profitLoss = (marketPrice - position.entryPrice) * position.qty;
      } else if (position.type === "SHORT") {
        profitLoss = (position.entryPrice - marketPrice) * position.qty;
      }
      setPnl(profitLoss);
    }
  }, [marketPrice, position]);

  // Buy order
  const handleBuy = () => {
    if (position) {
      alert("You already have an open position! Please exit first.");
      return;
    }
    const qty = 10; // Fixed quantity for now
    setPosition({ type: "LONG", qty, entryPrice: marketPrice });
    alert(`Bought ${qty} units at ₹${marketPrice}`);
  };

  // Sell order (short entry)
  const handleSell = () => {
    if (position) {
      alert("You already have an open position! Please exit first.");
      return;
    }
    const qty = 10;
    setPosition({ type: "SHORT", qty, entryPrice: marketPrice });
    alert(`Sold (Short) ${qty} units at ₹${marketPrice}`);
  };

  // Exit position
  const handleExit = () => {
    if (!position) {
      alert("No open position to exit!");
      return;
    }
    setBalance((prev) => prev + pnl);
    alert(
      `Position closed.\nP&L: ₹${pnl.toFixed(2)}\nNew Balance: ₹${(
        balance + pnl
      ).toFixed(2)}`
    );
    setPosition(null);
    setPnl(0);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Buy/Sell Trading Panel</h2>
      <p>Market Price: <strong>₹{marketPrice.toFixed(2)}</strong></p>
      <p>Balance: <strong>₹{balance.toFixed(2)}</strong></p>
      {position && (
        <>
          <p>Position: {position.type}</p>
          <p>Quantity: {position.qty}</p>
          <p>Entry Price: ₹{position.entryPrice.toFixed(2)}</p>
          <p style={{ color: pnl >= 0 ? "green" : "red" }}>
            P&L: ₹{pnl.toFixed(2)}
          </p>
        </>
      )}
      <button onClick={handleBuy} style={{ marginRight: "10px" }}>Buy</button>
      <button onClick={handleSell} style={{ marginRight: "10px" }}>Sell (Short)</button>
      <button onClick={handleExit}>Exit</button>
    </div>
  );
};

export default BuySell;
