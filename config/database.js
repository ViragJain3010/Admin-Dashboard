// config/database.js
const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.atlas_database_url;  // for global database
// const url = process.env.local_database_url;    // for local database

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      dbName: "AdminDashboard",
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;