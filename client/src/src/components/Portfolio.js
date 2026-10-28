import React from "react";
import "./Portfolio.css";

const Portfolio = () => {
  const portfolio = [
    { symbol: "TCS", quantity: 5, avgPrice: 3600, currentPrice: 3875 },
    { symbol: "INFY", quantity: 10, avgPrice: 1450, currentPrice: 1478 },
    { symbol: "RELIANCE", quantity: 8, avgPrice: 2700, currentPrice: 2750 },
    { symbol: "ITC", quantity: 20, avgPrice: 410, currentPrice: 405 },
    { symbol: "HDFCBANK", quantity: 7, avgPrice: 1500, currentPrice: 1522 },
    { symbol: "SBIN", quantity: 12, avgPrice: 570, currentPrice: 582 },
    { symbol: "WIPRO", quantity: 15, avgPrice: 400, currentPrice: 390 },
    { symbol: "HCLTECH", quantity: 10, avgPrice: 1300, currentPrice: 1290 },
    { symbol: "BAJFINANCE", quantity: 4, avgPrice: 7000, currentPrice: 7150 },
    { symbol: "DMART", quantity: 3, avgPrice: 3800, currentPrice: 3950 },
  ];

  let totalInvestment = 0;
  let currentValue = 0;

  portfolio.forEach(stock => {
    totalInvestment += stock.quantity * stock.avgPrice;
    currentValue += stock.quantity * stock.currentPrice;
  });

  const profitLoss = currentValue - totalInvestment;
  const oneDayReturn = (profitLoss / totalInvestment) * 100;

  return (
    <div className="portfolio-container">
      <h2>📁 Your Portfolio</h2>
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Avg Price ₹</th>
            <th>Current ₹</th>
            <th>Investment ₹</th>
            <th>Current Value ₹</th>
            <th>Profit/Loss ₹</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock) => {
            const investment = stock.quantity * stock.avgPrice;
            const value = stock.quantity * stock.currentPrice;
            const diff = value - investment;
            const diffClass = diff >= 0 ? "green" : "red";

            return (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.quantity}</td>
                <td>{stock.avgPrice}</td>
                <td>{stock.currentPrice}</td>
                <td>{investment}</td>
                <td>{value}</td>
                <td className={diffClass}>{diff.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="summary">
        <p><strong>Total Investment:</strong> ₹{totalInvestment.toFixed(2)}</p>
        <p><strong>Total Return (1 Day):</strong> {oneDayReturn.toFixed(2)}%</p>
        <p className={profitLoss >= 0 ? "green" : "red"}>
          <strong>Total {profitLoss >= 0 ? "Profit" : "Loss"}:</strong> ₹{Math.abs(profitLoss).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Portfolio;
