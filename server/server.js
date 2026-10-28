// server.js

// 1️⃣ Required packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // CORS package import करा

// 2️⃣ Load environment variables from .env
dotenv.config();

const app = express();

// 3️⃣ Middleware
app.use(express.json()); // JSON body parsing
app.use(cors()); // CORS enable करा (सर्व domains मधून requests allow करते)

// 4️⃣ MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Failed", err));

// 5️⃣ Routes
app.use("/api/auth", require("./routes/auth")); // Auth routes add करा

// 6️⃣ Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 7️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});