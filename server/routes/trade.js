const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Buy Stock
router.post("/buy", authMiddleware, async (req, res) => {
  const { stockSymbol, quantity, price } = req.body;

  if (!stockSymbol || quantity <= 0 || price <= 0) {
    return res.status(400).json({ error: "Invalid trade data" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const cost = quantity * price;

    if (user.balance < cost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= cost;

    // Check if stock already exists in portfolio
    const stockIndex = user.portfolio.findIndex(
      (s) => s.stockSymbol === stockSymbol
    );

    if (stockIndex >= 0) {
      // update avg price & quantity
      const oldStock = user.portfolio[stockIndex];
      const totalQty = oldStock.quantity + quantity;
      oldStock.avgPrice =
        (oldStock.avgPrice * oldStock.quantity + price * quantity) / totalQty;
      oldStock.quantity = totalQty;
    } else {
      user.portfolio.push({ stockSymbol, quantity, avgPrice: price });
    }

    await user.save();
    res.json({ balance: user.balance, portfolio: user.portfolio });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Sell Stock
router.post("/sell", authMiddleware, async (req, res) => {
  const { stockSymbol, quantity, price } = req.body;

  if (!stockSymbol || quantity <= 0 || price <= 0) {
    return res.status(400).json({ error: "Invalid trade data" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const stockIndex = user.portfolio.findIndex(
      (s) => s.stockSymbol === stockSymbol
    );
    if (stockIndex === -1) {
      return res.status(400).json({ error: "Stock not found in portfolio" });
    }

    const stock = user.portfolio[stockIndex];
    if (quantity > stock.quantity) {
      return res.status(400).json({ error: "Not enough shares to sell" });
    }

    // Deduct quantity
    stock.quantity -= quantity;

    // Add money to balance
    const revenue = quantity * price;
    user.balance += revenue;

    // If stock quantity 0, remove from portfolio
    if (stock.quantity === 0) {
      user.portfolio.splice(stockIndex, 1);
    }

    await user.save();
    res.json({ balance: user.balance, portfolio: user.portfolio });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
