import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// 📦 Components
import AuthPage from "./pages/AuthPage";
import CustomNavbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";
import Balance from "./components/Balance";
import StockDetails from "./components/StockDetails";
import StockView from "./components/StockView";
import BuySell from "./components/BuySell";
import Profile from "./components/Profile";
import Trade from "./components/Trade";
import StockData from "./components/StockData";
import Contact from "./components/Contact";
import OrderHistory from "./components/OrderHistory"; // ✅ OrderHistory component imported

// 🎨 Styles
import "./App.css";

function App() {
  const [availableBalance, setAvailableBalance] = useState(10000);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  const handleOrderExecution = (amount, pnlChange) => {
    setAvailableBalance(prev => prev - amount);
    setTotalInvestment(prev => prev + amount);
    setProfitLoss(prev => prev + pnlChange);
  };

  const handleStockSearch = (stockName) => {
    console.log("Search Query:", stockName);
  };

  return (
    <Router>
      <MainLayout
        availableBalance={availableBalance}
        totalInvestment={totalInvestment}
        profitLoss={profitLoss}
        handleOrderExecution={handleOrderExecution}
        handleStockSearch={handleStockSearch}
      />
    </Router>
  );
}

// 👉 Navbar conditionally दाखवण्यासाठी wrapper
function MainLayout({
  availableBalance,
  totalInvestment,
  profitLoss,
  handleOrderExecution,
  handleStockSearch,
}) {
  const location = useLocation();

  // या path वर Navbar दाखवायचा नाही
  const hideNavbarRoutes = ["/login", "/register", "/auth"];

  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <CustomNavbar onSearch={handleStockSearch} />
      )}

      <div className="content-wrapper">
        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <Dashboard
                availableBalance={availableBalance}
                totalInvestment={totalInvestment}
                profitLoss={profitLoss}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                availableBalance={availableBalance}
                totalInvestment={totalInvestment}
                profitLoss={profitLoss}
              />
            }
          />

          {/* Portfolio */}
          <Route
            path="/portfolio"
            element={<Portfolio totalInvestment={totalInvestment} />}
          />

          {/* Balance */}
          <Route path="/balance" element={<Balance />} />

          {/* Stock Details */}
          <Route path="/stock/:symbol" element={<StockDetails />} />
          <Route path="/stockview/:id" element={<StockView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/stocks" element={<StockData />} />

          {/* ✅ Contact Page */}
          <Route path="/contact" element={<Contact />} />

          {/* ✅ Order History Page */}
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order-history" element={<OrderHistory />} />

          {/* Buy/Sell */}
          <Route
            path="/buy-sell"
            element={<BuySell onOrderExecute={handleOrderExecution} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;