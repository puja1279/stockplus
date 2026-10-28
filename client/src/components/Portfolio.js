import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Portfolio.css";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalStats, setTotalStats] = useState({
    investment: 0,
    currentValue: 0,
    profitLoss: 0,
    totalReturn: 0
  });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Random price fluctuation function
  const fluctuatePrice = (currentPrice) => {
    const fluctuationPercent = (Math.random() - 0.5) * 2; // -1% to +1%
    return currentPrice * (1 + fluctuationPercent / 100);
  };

  useEffect(() => {
    // Get the currently logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setCurrentUser(loggedInUser);

    // Load portfolio from localStorage for the specific user
    const loadPortfolio = () => {
      if (!loggedInUser) return;
      
      // Get all portfolios from localStorage
      const allPortfolios = JSON.parse(localStorage.getItem("userPortfolios")) || {};
      
      // Get the portfolio for the current user
      const userPortfolio = allPortfolios[loggedInUser.email] || [];
      
      // Add initial currentPrice if not present (for new stocks)
      const portfolioWithPrices = userPortfolio.map(stock => {
        if (!stock.currentPrice) {
          return { ...stock, currentPrice: stock.avgPrice };
        }
        return stock;
      });
      
      setPortfolio(portfolioWithPrices);
      calculateTotalStats(portfolioWithPrices);
    };

    loadPortfolio();

    // Set up interval to update prices every second
    const intervalId = setInterval(() => {
      setPortfolio(prevPortfolio => {
        const updatedPortfolio = prevPortfolio.map(stock => ({
          ...stock,
          currentPrice: fluctuatePrice(stock.currentPrice)
        }));
        
        calculateTotalStats(updatedPortfolio);
        return updatedPortfolio;
      });
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const calculateTotalStats = (stocks) => {
    let totalInvestment = 0;
    let totalCurrentValue = 0;

    stocks.forEach((stock) => {
      totalInvestment += stock.quantity * stock.avgPrice;
      totalCurrentValue += stock.quantity * stock.currentPrice;
    });

    const profitLoss = totalCurrentValue - totalInvestment;
    const totalReturn = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

    setTotalStats({
      investment: totalInvestment,
      currentValue: totalCurrentValue,
      profitLoss: profitLoss,
      totalReturn: totalReturn
    });
  };

  const handleTrade = (symbol) => {
    navigate(`/trade?symbol=${symbol}`);
  };

  const getProfitLossClass = (value) => {
    return value >= 0 ? "profit" : "loss";
  };

  const getPriceChange = (avgPrice, currentPrice) => {
    return ((currentPrice - avgPrice) / avgPrice) * 100;
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0.1) return "↗";
    if (change < -0.1) return "↘";
    return "→";
  };

  if (!currentUser) {
    return (
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>📁 Your Portfolio</h1>
          <p>Please log in to view your portfolio</p>
        </div>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>📁 Your Portfolio</h1>
          <p>Track your investments and performance</p>
        </div>
        
        <div className="empty-portfolio">
          <div className="empty-icon">📊</div>
          <h3>No investments yet</h3>
          <p>Start building your portfolio by trading stocks</p>
          <button 
            className="trade-btn"
            onClick={() => navigate("/trade")}
          >
            Start Trading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Header */}
      <div className="portfolio-header">
        <div className="header-content">
          <h1>📁 Your Portfolio</h1>
          <p>Track your investments in real-time</p>
          <small>Logged in as: {currentUser.email}</small>
        </div>
        <button 
          className="trade-btn"
          onClick={() => navigate("/trade")}
        >
          + New Trade
        </button>
      </div>

      {/* Live indicator */}
      <div className="live-indicator">
        <span className="live-dot"></span>
        LIVE
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>₹{totalStats.investment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <p>Total Investment</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>₹{totalStats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
            <p>Current Value</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💹</div>
          <div className="card-content">
            <h3 className={getProfitLossClass(totalStats.profitLoss)}>
              {totalStats.profitLoss >= 0 ? "+" : "-"}₹{Math.abs(totalStats.profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h3>
            <p>Total P&L</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3 className={getProfitLossClass(totalStats.totalReturn)}>
              {totalStats.totalReturn >= 0 ? "+" : ""}{totalStats.totalReturn.toFixed(2)}%
            </h3>
            <p>Total Return</p>
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="portfolio-table-container">
        <div className="table-header">
          <h3>Your Holdings</h3>
          <span className="stock-count">{portfolio.length} stocks</span>
        </div>

        <div className="table-responsive">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Avg Price</th>
                <th>Current Price</th>
                <th>Change</th>
                <th>Investment</th>
                <th>Current Value</th>
                <th>P&L</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock, index) => {
                const investment = stock.quantity * stock.avgPrice;
                const currentValue = stock.quantity * stock.currentPrice;
                const profitLoss = currentValue - investment;
                const profitLossPercent = investment > 0 ? (profitLoss / investment) * 100 : 0;
                const priceChange = getPriceChange(stock.avgPrice, stock.currentPrice);

                return (
                  <tr key={index} className="portfolio-row">
                    <td>
                      <div className="stock-info">
                        <span className="stock-symbol">{stock.symbol}</span>
                        <span className="stock-name">{stock.name}</span>
                      </div>
                    </td>
                    <td>{stock.quantity}</td>
                    <td>₹{stock.avgPrice.toFixed(2)}</td>
                    <td>
                      <div className="current-price">
                        ₹{stock.currentPrice.toFixed(2)}
                        <span className={`price-change-indicator ${getProfitLossClass(priceChange)}`}>
                          {getPriceChangeIcon(priceChange)}
                        </span>
                      </div>
                    </td>
                    <td className={getProfitLossClass(priceChange)}>
                      {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                    </td>
                    <td>₹{investment.toFixed(2)}</td>
                    <td>₹{currentValue.toFixed(2)}</td>
                    <td>
                      <div className={`pl-value ${getProfitLossClass(profitLoss)}`}>
                        <span>{profitLoss >= 0 ? "+" : "-"}₹{Math.abs(profitLoss).toFixed(2)}</span>
                        <span className="pl-percent">({profitLoss >= 0 ? "+" : ""}{profitLossPercent.toFixed(2)}%)</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="action-btn trade"
                        onClick={() => handleTrade(stock.symbol)}
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart (Placeholder) */}
      <div className="performance-section">
        <h3>Portfolio Performance</h3>
        <div className="chart-placeholder">
          <p>📈 Real-time performance chart</p>
          <small>Prices updating every second</small>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;