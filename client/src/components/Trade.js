import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Trade.css";

const Trade = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState(0);
  const [isBuying, setIsBuying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);

    // Load available stocks
    const availableStocks = [
      { symbol: "RELIANCE", name: "Reliance Industries", price: 2870, change: -8 },
      { symbol: "TCS", name: "Tata Consultancy Services", price: 3850, change: 12 },
      { symbol: "INFY", name: "Infosys Ltd", price: 1450, change: 5 },
      { symbol: "HDFCBANK", name: "HDFC Bank", price: 1620, change: 7 },
      { symbol: "ITC", name: "ITC Ltd", price: 456, change: -3 },
      { symbol: "SBIN", name: "State Bank of India", price: 620, change: 9 }
    ];
    setStocks(availableStocks);

    // Set pre-selected stock from URL
    const symbolFromUrl = searchParams.get("symbol");
    if (symbolFromUrl) {
      const stock = availableStocks.find(s => s.symbol === symbolFromUrl);
      if (stock) {
        setSelectedStock(stock);
        setLimitPrice(stock.price);
      }
    }
  }, [navigate, searchParams]);

  // ✅ Order History save करण्यासाठी function
  const saveOrderToHistory = (orderData) => {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const newOrder = {
      id: `ORD${Date.now()}`,
      symbol: orderData.symbol,
      name: orderData.name,
      type: orderData.type,
      quantity: orderData.quantity,
      price: orderData.price,
      total: orderData.total,
      status: "completed",
      timestamp: new Date().toISOString(),
      fees: orderData.total * 0.001, // 0.1% fees
      executedPrice: orderData.price,
      executedQuantity: orderData.quantity
    };
    
    orderHistory.unshift(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    return newOrder;
  };

  const handleTrade = async () => {
    if (!selectedStock || quantity <= 0) return;

    const price = orderType === "market" ? selectedStock.price : limitPrice;
    const totalAmount = price * quantity;

    // Clear previous errors
    setBalanceError("");

    // Validate balance for buy orders
    if (isBuying) {
      if (totalAmount > user.balance) {
        setBalanceError("Insufficient balance to complete this trade!");
        return;
      }
    }

    setLoading(true);

    try {
      // Get all user portfolios from localStorage
      const allPortfolios = JSON.parse(localStorage.getItem("userPortfolios")) || {};
      
      // Get current user's portfolio
      const userPortfolio = allPortfolios[user.email] || [];
      
      if (isBuying) {
        // Buy logic
        const existingStock = userPortfolio.find(s => s.symbol === selectedStock.symbol);
        
        if (existingStock) {
          // Update existing stock
          existingStock.quantity += quantity;
          existingStock.avgPrice = ((existingStock.avgPrice * (existingStock.quantity - quantity)) + totalAmount) / existingStock.quantity;
        } else {
          // Add new stock
          userPortfolio.push({
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            quantity: quantity,
            avgPrice: price,
            currentPrice: selectedStock.price,
            purchaseDate: new Date().toISOString()
          });
        }

        // Update user balance
        user.balance -= totalAmount;
      } else {
        // Sell logic
        const existingStock = userPortfolio.find(s => s.symbol === selectedStock.symbol);
        
        if (!existingStock || existingStock.quantity < quantity) {
          alert("You don't have enough shares to sell!");
          setLoading(false);
          return;
        }

        // Calculate P&L
        const purchaseCost = existingStock.avgPrice * quantity;
        const saleValue = totalAmount;
        const profitLoss = saleValue - purchaseCost;

        existingStock.quantity -= quantity;
        if (existingStock.quantity === 0) {
          userPortfolio.splice(userPortfolio.indexOf(existingStock), 1);
        }

        // Update user balance
        user.balance += totalAmount;
      }

      // ✅ Save order to history
      const orderData = {
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        type: isBuying ? "buy" : "sell",
        quantity: quantity,
        price: price,
        total: totalAmount
      };
      saveOrderToHistory(orderData);

      // Save updated portfolio for this user
      allPortfolios[user.email] = userPortfolio;
      localStorage.setItem("userPortfolios", JSON.stringify(allPortfolios));
      
      // Update user in localStorage
      const updatedUser = { ...user };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Add to transaction history
      const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      transactions.unshift({
        id: Date.now(),
        type: isBuying ? "buy" : "sell",
        symbol: selectedStock.symbol,
        quantity: quantity,
        price: price,
        total: totalAmount,
        timestamp: new Date().toISOString(),
        status: "completed"
      });
      localStorage.setItem("transactions", JSON.stringify(transactions));

      alert(`${isBuying ? "Buy" : "Sell"} order executed successfully!`);
      
      // Reset form
      setQuantity(1);
      if (orderType === "limit") {
        setLimitPrice(selectedStock.price);
      }

    } catch (error) {
      console.error("Trade execution error:", error);
      alert("Trade execution failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedStock ? 
    (orderType === "market" ? selectedStock.price : limitPrice) * quantity : 0;

  return (
    <div className="trade-container">
      {/* Header */}
      <div className="trade-header">
        <h1>💹 Trade Stocks</h1>
        <p>Buy and sell stocks in real-time</p>
      </div>

      <div className="trade-content">
        {/* Left Panel - Stock Selection */}
        <div className="stock-selection">
          <h3>Available Stocks</h3>
          <div className="stocks-list">
            {stocks.map(stock => (
              <div 
                key={stock.symbol} 
                className={`stock-item ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedStock(stock);
                  setLimitPrice(stock.price);
                  setBalanceError(""); // Clear error when selecting new stock
                }}
              >
                <div className="stock-info">
                  <span className="symbol">{stock.symbol}</span>
                  <span className="name">{stock.name}</span>
                </div>
                <div className="stock-price">
                  <span className="price">₹{stock.price.toLocaleString()}</span>
                  <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Trading Interface */}
        <div className="trading-interface">
          <div className="trade-card">
            <div className="trade-type-toggle">
              <button 
                className={isBuying ? 'active' : ''}
                onClick={() => {
                  setIsBuying(true);
                  setBalanceError("");
                }}
                disabled={loading}
              >
                Buy
              </button>
              <button 
                className={!isBuying ? 'active' : ''}
                onClick={() => {
                  setIsBuying(false);
                  setBalanceError("");
                }}
                disabled={loading}
              >
                Sell
              </button>
            </div>

            {selectedStock && (
              <>
                <div className="selected-stock">
                  <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
                  <p className="current-price">Current Price: ₹{selectedStock.price.toLocaleString()}</p>
                </div>

                <div className="order-type">
                  <label>Order Type:</label>
                  <select 
                    value={orderType} 
                    onChange={(e) => {
                      setOrderType(e.target.value);
                      setBalanceError("");
                    }}
                    disabled={loading}
                  >
                    <option value="market">Market Order</option>
                    <option value="limit">Limit Order</option>
                  </select>
                </div>

                {orderType === "limit" && (
                  <div className="limit-price">
                    <label>Limit Price (₹):</label>
                    <input
                      type="number"
                      value={limitPrice}
                      onChange={(e) => {
                        setLimitPrice(parseFloat(e.target.value));
                        setBalanceError("");
                      }}
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="quantity-input">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 0;
                      setQuantity(newQuantity);
                      setBalanceError("");
                      
                      // Show error immediately if balance is insufficient
                      if (isBuying && selectedStock) {
                        const price = orderType === "market" ? selectedStock.price : limitPrice;
                        const total = price * newQuantity;
                        if (total > user.balance) {
                          setBalanceError("Insufficient balance to complete this trade!");
                        } else {
                          setBalanceError("");
                        }
                      }
                    }}
                    min="1"
                    disabled={loading}
                  />
                </div>

                {/* Balance Error Message */}
                {balanceError && (
                  <div className="error-message">
                    <span>⚠️</span>
                    {balanceError}
                  </div>
                )}

                <div className="order-summary">
                  <div className="summary-item">
                    <span>Estimated {orderType === 'market' ? 'Cost' : 'Value'}:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Available Balance:</span>
                    <span>₹{user?.balance?.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Balance After Trade:</span>
                    <span className={isBuying && totalAmount > user.balance ? 'error' : (isBuying ? 'negative' : 'positive')}>
                      ₹{(user?.balance - (isBuying ? totalAmount : -totalAmount)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  className={`execute-btn ${isBuying ? 'buy' : 'sell'} ${isBuying && totalAmount > user.balance ? 'disabled' : ''}`}
                  onClick={handleTrade}
                  disabled={!selectedStock || quantity <= 0 || loading || (isBuying && totalAmount > user.balance)}
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <span>{isBuying ? 'Buy' : 'Sell'} {quantity} shares of {selectedStock.symbol}</span>
                  )}
                </button>
              </>
            )}
          </div>

          {/* User Balance */}
          <div className="balance-card">
            <h4>Your Balance</h4>
            <div className="balance-amount">₹{user?.balance?.toLocaleString()}</div>
            <p>Available for trading</p>
            <button 
              className="view-orders-btn"
              onClick={() => navigate("/orders")}
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;