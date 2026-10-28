import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="%PUBLIC_URL%/datafeeds/udf/dist/polyfills.js"></script>
    <script src="%PUBLIC_URL%/datafeeds/udf/dist/bundle.js"></script>
    <title>Your App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>