// src/pages/StockPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./StockPage.css";

export default function StockPage() {
  const { id } = useParams(); // id from route: /stock/:id, e.g. "RELIANCE" or "RELIANCE.NS"
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert route id to symbol for Yahoo (add .NS if missing)
  const getQuerySymbol = (rid) => {
    if (!rid) return "";
    if (rid.includes(".") || rid.includes(":")) return rid; // already looks like symbol
    return `${rid}.NS`;
  };

  useEffect(() => {
    const symbol = getQuerySymbol(id);
    if (!symbol) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`/api/stocks/live/${encodeURIComponent(symbol)}`)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.quoteResponse?.result?.[0] ?? null;
        if (!data) {
          setError("No data returned from API for " + symbol);
          setStock(null);
        } else {
          setStock(data);
        }
      })
      .catch((err) => {
        console.error("StockPage fetch error:", err);
        setError("Failed to fetch stock data. Check server / proxy route.");
        setStock(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Try to execute order via backend if /api/trade exists. Fallback to alert.
  const executeOrder = async (side /* "buy"|"sell" */) => {
    if (!stock) return alert("No stock selected");

    const payload = {
      symbol: stock.symbol,
      quantity: Number(qty),
      price: stock.regularMarketPrice,
      side,
    };

    setOrderLoading(true);
    try {
      // Try backend trade route if available
      const resp = await axios.post("/api/trade/execute", payload, { timeout: 8000 });
      // Expect { success: true, order: { ... } } or similar from your backend
      if (resp?.data?.success) {
        alert(`${side.toUpperCase()} order placed: ${payload.quantity} ${payload.symbol}`);
      } else {
        // If backend responded but not success, show message
        const msg = resp?.data?.message || "Order not accepted by server";
        alert(`${side.toUpperCase()} failed: ${msg}`);
      }
    } catch (err) {
      // If backend route missing or error, fallback to local demo confirmation
      console.warn("Trade API error or missing — falling back to demo. ", err?.message || err);
      alert(
        `Demo ${side.toUpperCase()} executed:\n${payload.quantity} × ${payload.symbol} @ ₹${payload.price}\n(Backend trade route not available or failed.)`
      );
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="stockpage-root">
      <div className="stockpage-left">
        {loading ? (
          <div className="sp-loading">Loading stock...</div>
        ) : error ? (
          <div className="sp-error">{error}</div>
        ) : stock ? (
          <>
            <div className="sp-header">
              <div className="sp-title">
                <div className="sp-name">{stock.longName || stock.shortName || stock.symbol}</div>
                <div className="sp-symbol">{stock.symbol}</div>
              </div>

              <div className="sp-price">
                <div className="sp-price-value">₹{Number(stock.regularMarketPrice || 0).toLocaleString()}</div>
                <div className={`sp-change ${stock.regularMarketChangePercent >= 0 ? "green" : "red"}`}>
                  {Number(stock.regularMarketChange).toFixed(2)} ({Number(stock.regularMarketChangePercent).toFixed(2)}%)
                </div>
              </div>
            </div>

            <div className="sp-meta">
              <div>Open: ₹{stock.regularMarketOpen ?? "-"}</div>
              <div>High: ₹{stock.regularMarketDayHigh ?? "-"}</div>
              <div>Low: ₹{stock.regularMarketDayLow ?? "-"}</div>
              <div>Volume: {stock.regularMarketVolume ?? "-"}</div>
            </div>

            {/* TradingView embed */}
            <div className="sp-chart">
              {/* NOTE: TradingView embed may block some symbols; this iframe is a simple embed.
                  If the widget fails, you'll need to use TradingView widget JS (official) with proper symbol mapping. */}
              <iframe
                title={`chart-${stock.symbol}`}
                src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(stock.symbol)}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&hideideas=1`}
                frameBorder="0"
                width="100%"
                height="480"
                allowTransparency="true"
                scrolling="no"
              ></iframe>
            </div>
          </>
        ) : (
          <div className="sp-empty">Select a stock from dashboard</div>
        )}
      </div>

      <aside className="stockpage-right">
        <div className="trade-box">
          <h3>Quick Trade</h3>
          <div className="trade-row">
            <label>Qty</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="trade-row">
            <label>Price</label>
            <div className="price-box">₹{stock ? Number(stock.regularMarketPrice).toFixed(2) : "-"}</div>
          </div>

          <div className="trade-actions">
            <button className="buy" onClick={() => executeOrder("buy")} disabled={orderLoading || !stock}>
              {orderLoading ? "Processing..." : "Buy"}
            </button>
            <button className="sell" onClick={() => executeOrder("sell")} disabled={orderLoading || !stock}>
              {orderLoading ? "Processing..." : "Sell"}
            </button>
          </div>
        </div>

        <div className="info-box">
          <h4>About</h4>
          <p>Symbol: {stock?.symbol ?? "-"}</p>
          <p>Exchange: {stock?.fullExchangeName ?? "-"}</p>
          <p>Market Time: {stock?.regularMarketTime ? new Date(stock.regularMarketTime * 1000).toLocaleString() : "-"}</p>
        </div>

        <div className="notes">
          <h4>Notes</h4>
          <ul>
            <li>Live data via server proxy: <code>/api/stocks/live/:symbol</code></li>
            <li>If trade API missing, Buy/Sell will show demo confirmation.</li>
            <li>For production use: secure auth, validation, and real order routing required.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
