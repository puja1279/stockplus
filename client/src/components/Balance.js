import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Balance.css";

const Balance = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState("");

  // ✅ Fetch balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/balance/update",
        { type: actionType, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(res.data.balance);
      setAmount("");
      setActionType("");
    } catch (err) {
      alert(err.response?.data?.error || "Server Error");
    }
  };

  return (
    <div className="balance-container">
      <h2>💰 My Balance</h2>
      <div className="balance-card">
        <p>₹ {balance.toLocaleString()}</p>
      </div>

      <div className="balance-actions">
        <button onClick={() => setActionType("add")}>Add Funds</button>
        <button onClick={() => setActionType("withdraw")}>Withdraw</button>
      </div>

      {actionType && (
        <form onSubmit={handleSubmit} className="balance-form">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit">
            {actionType === "add" ? "Add" : "Withdraw"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Balance;
