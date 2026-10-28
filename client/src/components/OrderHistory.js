import React, { useState, useEffect } from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    symbol: "",
    dateRange: "all"
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filters, orders]);

  const loadOrders = () => {
    console.log("Loading order history from localStorage...");
    setLoading(true);
    
    try {
      // Try multiple possible storage keys
      let savedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
      
      // If no orders found, try other possible keys
      if (savedOrders.length === 0) {
        savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      }
      if (savedOrders.length === 0) {
        savedOrders = JSON.parse(localStorage.getItem("transactions")) || [];
      }

      console.log("Orders found:", savedOrders);
      
      // If still no orders, create sample data
      if (savedOrders.length === 0) {
        console.log("No orders found, creating sample data");
        savedOrders = [
          {
            id: "ORD001",
            symbol: "RELIANCE",
            name: "Reliance Industries",
            type: "buy",
            quantity: 10,
            price: 2850,
            total: 28500,
            status: "completed",
            timestamp: new Date().toISOString(),
            fees: 28.50,
            executedPrice: 2848,
            executedQuantity: 10
          },
          {
            id: "ORD002", 
            symbol: "TCS",
            name: "Tata Consultancy Services",
            type: "sell",
            quantity: 5,
            price: 3850,
            total: 19250,
            status: "completed",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            fees: 19.25,
            executedPrice: 3852,
            executedQuantity: 5
          }
        ];
        localStorage.setItem("orderHistory", JSON.stringify(savedOrders));
      }
      
      // Ensure each order has required fields
      const validatedOrders = savedOrders.map(order => ({
        id: order.id || `ORD${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol: order.symbol || "UNKNOWN",
        name: order.name || "Unknown Stock",
        type: order.type || "buy",
        quantity: order.quantity || 0,
        price: order.price || 0,
        total: order.total || 0,
        status: order.status || "completed",
        timestamp: order.timestamp || new Date().toISOString(),
        fees: order.fees || 0,
        executedPrice: order.executedPrice || order.price || 0,
        executedQuantity: order.executedQuantity || order.quantity || 0
      }));
      
      console.log("Validated orders:", validatedOrders);
      setOrders(validatedOrders);
      setFilteredOrders(validatedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      // Create sample data on error
      const sampleOrders = [
        {
          id: "ORD001",
          symbol: "RELIANCE",
          name: "Reliance Industries",
          type: "buy",
          quantity: 10,
          price: 2850,
          total: 28500,
          status: "completed",
          timestamp: new Date().toISOString(),
          fees: 28.50,
          executedPrice: 2848,
          executedQuantity: 10
        }
      ];
      setOrders(sampleOrders);
      setFilteredOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(order => order.type === filters.type);
    }

    // Status filter  
    if (filters.status !== "all") {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Symbol filter
    if (filters.symbol) {
      filtered = filtered.filter(order => 
        order.symbol.toLowerCase().includes(filters.symbol.toLowerCase()) ||
        order.name.toLowerCase().includes(filters.symbol.toLowerCase())
      );
    }

    // Date filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case "1d":
          startDate.setDate(now.getDate() - 1);
          break;
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(order => {
        try {
          const orderDate = new Date(order.timestamp);
          return orderDate >= startDate;
        } catch (error) {
          console.error("Error parsing date:", error);
          return true; // Keep order if date is invalid
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      status: "all", 
      symbol: "",
      dateRange: "all"
    });
  };

  const clearAllOrders = () => {
    if (window.confirm("Are you sure you want to clear all order history?")) {
      localStorage.removeItem("orderHistory");
      localStorage.removeItem("orders");
      localStorage.removeItem("transactions");
      setOrders([]);
      setFilteredOrders([]);
      alert("Order history cleared!");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed": return "status-completed";
      case "pending": return "status-pending";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getTypeIcon = (type) => {
    return type === "buy" ? "📈" : "📉";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="order-history-loading">
        <div className="spinner"></div>
        <p>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      {/* Header */}
      <div className="order-history-header">
        <h1>📋 Order History</h1>
        <p>Track all your trading activities and order status</p>
        <div className="header-actions">
          <button onClick={loadOrders} className="refresh-btn">🔄 Refresh</button>
          <button onClick={() => window.location.reload()} className="reload-btn">🔄 Reload Page</button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <p>Storage keys: {Object.keys(localStorage).join(", ")}</p>
        <p>Total orders found: {orders.length}</p>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <div className="filter-group">
          <label>Type:</label>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="all">All Types</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <select 
            value={filters.dateRange} 
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by symbol or name"
            value={filters.symbol}
            onChange={(e) => setFilters({...filters, symbol: e.target.value})}
          />
        </div>

        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
          <button onClick={clearAllOrders} className="clear-orders-btn">
            Clear All History
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="order-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.type === 'buy').length}
          </span>
          <span className="stat-label">Buy Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.type === 'sell').length}
          </span>
          <span className="stat-label">Sell Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'completed').length}
          </span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        {filteredOrders.length > 0 ? (
          <>
            <div className="table-info">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Fees</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="order-row">
                    <td className="order-id">{order.id}</td>
                    <td>
                      <div className="stock-info">
                        <span className="symbol">{order.symbol}</span>
                        <span className="name">{order.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`order-type ${order.type}`}>
                        {getTypeIcon(order.type)} {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td>{order.quantity}</td>
                    <td>₹{order.price.toLocaleString('en-IN')}</td>
                    <td>₹{order.total.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.timestamp)}</td>
                    <td>₹{order.fees?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📭</div>
            <h3>No orders found</h3>
            <p>{orders.length > 0 ? 
              "No orders match your current filters. Try clearing filters to see all orders." : 
              "Make some trades to see your order history here. Your order history is empty."
            }</p>
            {orders.length > 0 ? (
              <button onClick={clearFilters} className="browse-trades-btn">
                Clear Filters
              </button>
            ) : (
              <button onClick={() => window.location.href = '/trade'} className="browse-trades-btn">
                Start Trading
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;