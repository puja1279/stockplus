// src/pages/StockDetailPage.js
import React from "react";
import { useParams } from "react-router-dom";
import StockChart from "../components/StockChart";

const StockDetailPage = () => {
  const { stockId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>{stockId} Chart</h2>
      <StockChart symbol={`${stockId}.NS`} />
    </div>
  );
};

export default StockDetailPage;
