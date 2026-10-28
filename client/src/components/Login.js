import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login", 
        formData
      );
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));
      
      if (onLogin) {
        onLogin(res.data.user);
      }
      
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Animation */}
      <div className="market-background">
        <div className="stock-chart-animation"></div>
        <div className="floating-elements">
          <div className="floating-element">📈</div>
          <div className="floating-element">💰</div>
          <div className="floating-element">📊</div>
          <div className="floating-element">💹</div>
        </div>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <span className="logo-text">TREDX</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your trading account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="btn-loading">
                <div className="spinner"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </p>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        {/* Market Stats */}
        <div className="market-stats">
          <div className="stat-item">
            <span className="stat-value">+1.2%</span>
            <span className="stat-label">NIFTY 50</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">+0.8%</span>
            <span className="stat-label">SENSEX</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">+2.1%</span>
            <span className="stat-label">BANK NIFTY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;