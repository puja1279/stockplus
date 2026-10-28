// src/components/TradingChart.js
import React from "react";

export default function TradingChart({ symbol }) {
  if (!symbol) return <p style={{ textAlign: "center" }}>कृपया स्टॉक निवडा.</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <iframe
        title="TradingView Chart"
        src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
          symbol
        )}&interval=D&hidesidetoolbar=1&symboledit=1&withdateranges=1&hideideas=1&theme=light&timezone=Asia%2FKolkata`}
        width="100%"
        height="520"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}
