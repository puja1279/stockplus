// src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const stocks = [
  { id: "RELIANCE", name: "Reliance Industries", price: "2870", change: "-8" },
  { id: "TCS", name: "TCS", price: "3850", change: "+12" },
  { id: "INFY", name: "Infosys Ltd", price: "1450", change: "+5" },
  { id: "HDFCBANK", name: "HDFC Bank", price: "1620", change: "+7" },
  { id: "ITC", name: "ITC Ltd", price: "456", change: "-3" },
  // add rest of your 50 stocks
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = (stockId) => {
    navigate(`/stock/${stockId}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Top Traded Stocks</h1>
      <div className="stock-grid">
        {stocks.map((stock) => (
          <div className="stock-card" key={stock.id} onClick={() => handleClick(stock.id)}>
            <h3>{stock.name}</h3>
            <p className="stock-price">₹{stock.price}</p>
            <p className={`stock-change ${parseFloat(stock.change) < 0 ? 'red' : 'green'}`}>
              {stock.change} ({((parseFloat(stock.change) / parseFloat(stock.price)) * 100).toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
