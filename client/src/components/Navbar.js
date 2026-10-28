import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    setUser(storedUser);

    // Click outside to close search results
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle search input changes - UPDATED CODE
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value); // ✅ प्रथम state update
    
    // ✅ थेट e.target.value वापरा
    if (value.length > 1) {
      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error searching stocks:', error);
        setSearchResults([]);
      }
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '' && onSearch) {
      onSearch(searchTerm.toUpperCase());
      setShowResults(false);
    }
  };

  const handleResultClick = (stock) => {
    // Navigate to stock detail page with TradingView chart
    navigate(`/stock/${stock.symbol}`);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📈</span>
          <span className="logo-text">TREDX</span>
        </Link>

        {/* Search Bar - Only show when user is logged in */}
        {/* {user && (
          <div className="search-container" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                onFocus={() => searchTerm.length > 1 && setShowResults(true)}
              />
              <button type="submit" className="search-btn">
                <span className="search-icon">🔍</span>
              </button>
            </form>
            
            {/* Search Results Dropdown 
            {showResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(stock => (
                  <div 
                    key={stock.symbol} 
                    className="search-result-item"
                    onClick={() => handleResultClick(stock)}
                  >
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-name">{stock.name || 'N/A'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} */}

        {/* Desktop Navigation */}
        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          {!user ? (
            // Not logged in - Show only Register and Login
            <div className="nav-items">
              <Link to="/register" className={`nav-link ${isActive('/register')}`}>
                Register
              </Link>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                Login
              </Link>
            </div>
          ) : (
            // Logged in - Show all navigation options
            <div className="nav-items">
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                <span className="nav-icon">🏠</span>
                Dashboard
              </Link>
              <Link to="/trade" className={`nav-link ${isActive('/trade')}`}>
                <span className="nav-icon">💹</span>
                Trade
              </Link>
              <Link to="/portfolio" className={`nav-link ${isActive('/portfolio')}`}>
                <span className="nav-icon">💼</span>
                Portfolio
              </Link>
              <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
                <span className="nav-icon">📋</span>
                Order History
              </Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                <span className="nav-icon">👤</span>
                Profile
              </Link>
              
              {/* User dropdown */}
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                <div className="dropdown-content">
                  <Link to="/profile" className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    My Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;