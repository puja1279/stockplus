// src/components/StockChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StockChart({ symbol }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`
        );

        const result = response.data.chart.result[0];
        const timestamps = result.timestamp.map((ts) =>
          new Date(ts * 1000).toLocaleDateString()
        );
        const prices = result.indicators.quote[0].close;

        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: `${symbol} Stock Price`,
              data: prices,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    fetchData();
  }, [symbol]);

  if (!chartData) return <p>Loading chart...</p>;

  return <Line data={chartData} options={{ responsive: true }} />;
}

export default StockChart;
