import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// 📦 Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";
import Trade from "./components/Trade";
import StockDetailPage from "./pages/StockDetailPage"; // ✅ StockDetailPage import करा
import Profile from "./components/Profile";
import Balance from "./components/Balance";
import OrderHistory from "./components/OrderHistory";

// 🎨 Styles
import "./App.css";

// Search Handler Component
const SearchHandler = ({ children, onSearch }) => {
  const navigate = useNavigate();
  
  const handleSearch = (searchTerm) => {
    // Stock detail page वर navigate करा
    navigate(`/stock/${searchTerm}`);
  };
  
  return React.cloneElement(children, { onSearch: handleSearch });
};

function App() {
  const [user, setUser] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(10000);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setAvailableBalance(loggedInUser.balance || 10000);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAvailableBalance(userData.balance || 10000);
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setAvailableBalance(10000);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userPortfolio");
    localStorage.removeItem("transactions");
    localStorage.removeItem("orderHistory");
  };

  const updateBalance = (newBalance) => {
    setAvailableBalance(newBalance);
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Show Navbar only if user is logged in */}
        {user && (
          <SearchHandler>
            <Navbar user={user} onLogout={handleLogout} />
          </SearchHandler>
        )}
        
        <div className="content-wrapper">
          <Routes>
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={<Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={<Register onLogin={handleLogin} />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                user ? (
                  <Dashboard 
                    user={user}
                    availableBalance={availableBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  <Dashboard 
                    user={user}
                    availableBalance={availableBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            <Route 
              path="/portfolio" 
              element={
                user ? (
                  <Portfolio 
                    user={user}
                    availableBalance={availableBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            <Route 
              path="/trade" 
              element={
                user ? (
                  <Trade 
                    user={user}
                    availableBalance={availableBalance}
                    updateBalance={updateBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            <Route 
              path="/orders" 
              element={
                user ? (
                  <OrderHistory 
                    user={user}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            {/* ✅ StockDetailPage वापरा */}
            <Route 
              path="/stock/:symbol" 
              element={
                user ? (
                  <StockDetailPage />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            <Route 
              path="/profile" 
              element={
                user ? (
                  <Profile 
                    user={user}
                    updateBalance={updateBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            <Route 
              path="/balance" 
              element={
                user ? (
                  <Balance 
                    user={user}
                    availableBalance={availableBalance}
                    updateBalance={updateBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />

            {/* Redirect to login for any unknown routes */}
            <Route 
              path="*" 
              element={
                user ? (
                  <Dashboard 
                    user={user}
                    availableBalance={availableBalance}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;