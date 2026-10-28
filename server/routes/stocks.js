const express = require("express");
const axios = require("axios");
const router = express.Router();
const Stock = require('../models/Stock');

// ✅ Get stock quote from Yahoo Finance
router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
    );
    
    if (!response.data.quoteResponse || !response.data.quoteResponse.result || response.data.quoteResponse.result.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    
    const data = response.data.quoteResponse.result[0];
    
    res.json({
      symbol: data.symbol,
      name: data.longName || data.shortName,
      price: data.regularMarketPrice,
      change: data.regularMarketChange,
      percentChange: data.regularMarketChangePercent,
    });
  } catch (err) {
    console.error("Error fetching stock data:", err);
    res.status(500).json({ error: "Error fetching stock data" });
  }
});

// ✅ Search for stocks
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters long" });
    }
    
    // Database मधून search करा
    let stocks = [];
    
    try {
      stocks = await Stock.find({
        $or: [
          { symbol: { $regex: q, $options: 'i' } },
          { name: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);
    } catch (dbError) {
      console.error('Database search error:', dbError);
    }
    
    // Yahoo Finance API वरून fetch करा
    if (stocks.length < 5) {
      try {
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=10&newsCount=0`
        );
        
        if (response.data.quotes && response.data.quotes.length > 0) {
          const apiStocks = response.data.quotes.map(quote => ({
            symbol: quote.symbol,
            name: quote.longname || quote.shortname || 'N/A',
            exchange: quote.exchange,
            type: quote.quoteType,
          }));
          
          // Results combine करा
          const existingSymbols = new Set(stocks.map(s => s.symbol));
          const uniqueApiStocks = apiStocks.filter(stock => !existingSymbols.has(stock.symbol));
          
          stocks = [...stocks, ...uniqueApiStocks.slice(0, 10 - stocks.length)];
        }
      } catch (apiError) {
        console.error('Yahoo Finance API Error:', apiError);
      }
    }
    
    res.json(stocks);
  } catch (error) {
    console.error('Error searching for stocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;