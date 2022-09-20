const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to database");
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { connectDB };
