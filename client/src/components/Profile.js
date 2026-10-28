import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [marketNews, setMarketNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch User from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
      setBalance(storedUser.balance || 0);
    }
    fetchMarketNews();
    fetchTransactionHistory();
  }, []);

  // ✅ Fetch Market News
  const fetchMarketNews = async () => {
    try {
      const response = await axios.get(
        "https://newsapi.org/v2/everything?q=stock+market&apiKey=YOUR_NEWS_API_KEY"
      );
      setMarketNews(response.data.articles.slice(0, 5));
    } catch (error) {
      console.log("Using mock news data due to API limit");
      setMarketNews([
        {
          title: "Stock Market Hits All-Time High",
          url: "#",
          source: { name: "Financial Times" },
          publishedAt: new Date().toISOString()
        },
        {
          title: "New RBI Regulations Impact Banking Stocks",
          url: "#",
          source: { name: "Economic Times" },
          publishedAt: new Date().toISOString()
        }
      ]);
    }
  };

  // ✅ Fetch Transaction History
  const fetchTransactionHistory = () => {
    const history = JSON.parse(localStorage.getItem("transactionHistory")) || [];
    setTransactions(history.slice(0, 10));
  };

  // ✅ Handle Balance Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newBalance = actionType === "add" 
          ? balance + parseFloat(amount)
          : balance - parseFloat(amount);

        setBalance(newBalance);
        
        // Update user in localStorage
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        // Add to transaction history
        const newTransaction = {
          id: Date.now(),
          type: actionType,
          amount: parseFloat(amount),
          date: new Date().toLocaleString(),
          status: "completed"
        };
        
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        localStorage.setItem("transactionHistory", JSON.stringify(updatedTransactions));

        setAmount("");
        setActionType("");
        setLoading(false);
        
        alert(`${actionType === "add" ? "Added" : "Withdrawn"} ₹${amount} successfully!`);
      }, 1000);

    } catch (err) {
      alert("Transaction failed. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Navigate to Contact page
  const handleContactSupport = () => {
    navigate("/contact");
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Please login to view profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>👤 Account Profile</h1>
          <p>Manage your account and track your financial activities</p>
        </div>
        <div className="balance-display">
          <span className="balance-label">Available Balance</span>
          <span className="balance-amount">₹{balance.toLocaleString()}</span>
        </div>
      </div>

      <div className="profile-content">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <span className="user-status">Verified Account</span>
            </div>
          </div>

          <nav className="profile-nav">
            <button 
              className={activeTab === "overview" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button 
              className={activeTab === "transactions" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("transactions")}
            >
              💳 Transactions
            </button>
            <button 
              className={activeTab === "news" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("news")}
            >
              📰 Market News
            </button>
            <button 
              className={activeTab === "settings" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="financial-cards">
                <div className="finance-card">
                  <div className="card-icon">💰</div>
                  <div className="card-content">
                    <h3>₹{balance.toLocaleString()}</h3>
                    <p>Available Balance</p>
                  </div>
                </div>

                <div className="finance-card">
                  <div className="card-icon">📈</div>
                  <div className="card-content">
                    <h3>₹{(balance * 0.05).toLocaleString()}</h3>
                    <p>Monthly Profit</p>
                  </div>
                </div>

                <div className="finance-card">
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <h3>12.5%</h3>
                    <p>Portfolio Growth</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button 
                    className="action-btn primary"
                    onClick={() => setActionType("add")}
                  >
                    ➕ Add Funds
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => setActionType("withdraw")}
                  >
                    ➖ Withdraw
                  </button>
                </div>

                {actionType && (
                  <div className="transaction-form">
                    <h4>{actionType === "add" ? "Add Funds" : "Withdraw Funds"}</h4>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          min="1"
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : actionType === "add" ? "Add Funds" : "Withdraw"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="tab-content">
              <h3>Recent Transactions</h3>
              <div className="transactions-list">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-info">
                        <span className={`transaction-type ${transaction.type}`}>
                          {transaction.type.toUpperCase()}
                        </span>
                        <span className="transaction-date">{transaction.date}</span>
                      </div>
                      <div className="transaction-amount">
                        <span className={transaction.type}>
                          {transaction.type === "add" ? "+" : "-"}₹{transaction.amount}
                        </span>
                        <span className="transaction-status">{transaction.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-transactions">No transactions yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="tab-content">
              <h3>Latest Market News</h3>
              <div className="news-list">
                {marketNews.map((news, index) => (
                  <a key={index} href={news.url} className="news-item" target="_blank" rel="noopener noreferrer">
                    <h4>{news.title}</h4>
                    <div className="news-meta">
                      <span>{news.source.name}</span>
                      <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-content">
              <h3>Account Settings</h3>
              <div className="settings-list">
                {/* <div className="setting-item">
                  <h4>Personal Information</h4>
                  <p>Update your name, email, and contact details</p>
                  <button className="edit-btn">Edit</button>
                </div> */}
                <div className="setting-item">
                  <h4>Contact Support</h4>
                  <p>Get help with your account or report issues</p>
                  <button className="edit-btn" onClick={handleContactSupport}>
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;