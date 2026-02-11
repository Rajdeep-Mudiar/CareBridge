require('dotenv').config();
const mongoose = require('mongoose');

console.log("Testing MongoDB Connection...");
console.log("URI Length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : "undefined");
console.log("URI Start:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + "..." : "undefined");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connection Successful!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection Failed:", err.message);
    process.exit(1);
  });
