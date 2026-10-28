// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const stocks = [
  { id: "RELIANCE", name: "Reliance Industries", price: "2870", change: "-8" },
  { id: "TCS", name: "Tata Consultancy Services", price: "3850", change: "+12" },
  { id: "INFY", name: "Infosys Ltd", price: "1450", change: "+5" },
  { id: "HDFCBANK", name: "HDFC Bank", price: "1620", change: "+7" },
  { id: "ITC", name: "ITC Ltd", price: "456", change: "-3" },
  { id: "SBIN", name: "State Bank of India", price: "620", change: "+9" },
  { id: "WIPRO", name: "Wipro Ltd", price: "430", change: "+2" },
  { id: "HCLTECH", name: "HCL Technologies", price: "1420", change: "-6" },
  { id: "AXISBANK", name: "Axis Bank", price: "1080", change: "+4" },
  { id: "LT", name: "Larsen & Toubro", price: "3650", change: "-11" },
  { id: "ADANIENT", name: "Adani Enterprises", price: "3120", change: "+16" },
  { id: "BAJFINANCE", name: "Bajaj Finance", price: "7800", change: "+33" },
  { id: "ULTRACEMCO", name: "UltraTech Cement", price: "9450", change: "-18" },
  { id: "ASIANPAINT", name: "Asian Paints", price: "3030", change: "+14" },
  { id: "SUNPHARMA", name: "Sun Pharma", price: "1240", change: "-5" },
  { id: "ONGC", name: "ONGC", price: "180", change: "-2" },
  { id: "COALINDIA", name: "Coal India", price: "275", change: "+1" },
  { id: "BPCL", name: "BPCL", price: "470", change: "+3" },
  { id: "IOC", name: "IOC", price: "110", change: "-1" },
  { id: "POWERGRID", name: "Power Grid", price: "230", change: "+2" },
  { id: "TITAN", name: "Titan Company", price: "3520", change: "+10" },
  { id: "BAJAJFINSV", name: "Bajaj Finserv", price: "1800", change: "+8" },
  { id: "HINDUNILVR", name: "Hindustan Unilever", price: "2450", change: "-7" },
  { id: "KOTAKBANK", name: "Kotak Mahindra Bank", price: "1800", change: "+6" },
  { id: "TECHM", name: "Tech Mahindra", price: "1180", change: "+4" },
  { id: "ICICIBANK", name: "ICICI Bank", price: "1125", change: "+3" },
  { id: "NTPC", name: "NTPC", price: "350", change: "+2" },
  { id: "TATAMOTORS", name: "Tata Motors", price: "950", change: "+11" },
  { id: "HINDALCO", name: "Hindalco", price: "670", change: "+6" },
  { id: "JSWSTEEL", name: "JSW Steel", price: "880", change: "-4" },
  { id: "VEDL", name: "Vedanta Ltd", price: "360", change: "+3" },
  { id: "ADANIGREEN", name: "Adani Green", price: "1140", change: "-7" },
  { id: "ADANIPORTS", name: "Adani Ports", price: "1025", change: "+5" },
  { id: "MARUTI", name: "Maruti Suzuki", price: "12450", change: "+45" },
  { id: "EICHERMOT", name: "Eicher Motors", price: "3850", change: "-10" },
  { id: "TATAPOWER", name: "Tata Power", price: "320", change: "+2" },
  { id: "HEROMOTOCO", name: "Hero MotoCorp", price: "4250", change: "+18" },
  { id: "TVSMOTOR", name: "TVS Motor", price: "1900", change: "-8" },
  { id: "DRREDDY", name: "Dr. Reddy's", price: "5850", change: "-5" },
  { id: "CIPLA", name: "Cipla", price: "1260", change: "+2" },
  { id: "DIVISLAB", name: "Divi's Lab", price: "4620", change: "+6" },
  { id: "BAJAJ-AUTO", name: "Bajaj Auto", price: "5900", change: "+7" },
  { id: "NESTLEIND", name: "Nestle India", price: "24800", change: "-50" },
  { id: "BRITANNIA", name: "Britannia", price: "4900", change: "+10" },
  { id: "DABUR", name: "Dabur India", price: "590", change: "-2" },
  { id: "GODREJCP", name: "Godrej Consumer", price: "1140", change: "+4" },
  { id: "TATACHEM", name: "Tata Chemicals", price: "1050", change: "-3" },
  { id: "M&M", name: "Mahindra & Mahindra", price: "1920", change: "+6" },
  { id: "SIEMENS", name: "Siemens", price: "5600", change: "+8" }
];

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ जर login user नसेल तर redirect कर
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleClick = (stockId) => {
    navigate(`/stock/${stockId}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Top 54 Traded Stocks</h1>
      <div className="stock-grid">
        {stocks.map((stock) => (
          <div
            className="stock-card"
            key={stock.id}
            onClick={() => handleClick(stock.id)}
          >
            <h3>{stock.name}</h3>
            <p className="stock-price">₹{stock.price}</p>
            <p
              className={`stock-change ${
                parseFloat(stock.change) < 0 ? 'red' : 'green'
              }`}
            >
              {stock.change} (
              {(
                (parseFloat(stock.change) / parseFloat(stock.price)) *
                100
              ).toFixed(2)}
              %)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
