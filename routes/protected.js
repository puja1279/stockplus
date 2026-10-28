const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route: Portfolio
router.get("/portfolio", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your portfolio 📈",
    userId: req.user.id,
    portfolio: [
      { stock: "RELIANCE", qty: 10, avgPrice: 2500 },
      { stock: "TCS", qty: 5, avgPrice: 3600 },
    ],
  });
});

module.exports = router;
