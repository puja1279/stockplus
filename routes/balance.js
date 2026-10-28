const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // verify token

const router = express.Router();

// ✅ Get Balance
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update Balance
router.post("/update", authMiddleware, async (req, res) => {
  const { type, amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === "withdraw" && amount > user.balance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    if (type === "add") user.balance += amount;
    else if (type === "withdraw") user.balance -= amount;

    await user.save();
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
