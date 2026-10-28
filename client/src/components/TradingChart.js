// src/components/TradingChart.js
import React, { useEffect, useRef } from 'react';

const TradingChart = ({ symbol }) => {
  const containerRef = useRef();
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Clean up previous chart
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Load TradingView script if not already loaded
    if (!window.TradingView && !scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        initChart();
      };
      document.head.appendChild(script);
    } else if (window.TradingView) {
      initChart();
    }

    function initChart() {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          width: "100%",
          height: 500,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id
        });
      }
    }

    return () => {
      // Clean up on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container">
      <div id={`tradingview_${symbol}`} ref={containerRef} style={{ height: '500px' }}></div>
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${symbol}/`} rel="noopener noreferrer" target="_blank">
          {symbol} Chart
        </a> by TradingView
      </div>
    </div>
  );
};

export default TradingChart;