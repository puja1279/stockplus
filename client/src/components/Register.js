import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css";

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Validation functions
  const validateName = (name) => {
    return name.length >= 3;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!validateName(name)) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid Email Format");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(res.data.user || { name, email, balance: 10000 })
      );

      if (onLogin) {
        onLogin(res.data.user || { name, email, balance: 10000 });
      }

      // Show success alert instead of redirecting
      setSuccess(true);
      alert("Registration Successful! ✅");
      
      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
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
          <div className="floating-element">🚀</div>
          <div className="floating-element">📈</div>
          <div className="floating-element">💎</div>
          <div className="floating-element">🔥</div>
        </div>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <span className="logo-text">TREDX</span>
          </div>
          <h1>Create Account</h1>
          <p>Start your trading journey today</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span>✅</span>
            Registration successful! You can now log in.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name (min. 3 characters)"
              value={name}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
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
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="benefits-section">
          <h3>Why Join TREDX?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">💹</span>
              <span>Real-time Stock Trading</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <span>Advanced Charting Tools</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🛡️</span>
              <span>Secure Transactions</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <span>₹10,000 Welcome Bonus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;