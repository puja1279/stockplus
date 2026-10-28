import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') onSearch(searchTerm.toUpperCase());
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span>📈</span> <b>StockPlus</b>
      </div>

      <ul className="nav-links">
        {!user ? (
          // ✅ login नसल्यावर फक्त Register आणि Login
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          // ✅ login झाल्यावर बाकी सगळे modules
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/trade">Trade</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/balance">Balance</Link></li>

            {/* ✅ New Stocks option */}
            <li><Link to="/stocks">Stocks</Link></li>

            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {user && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
