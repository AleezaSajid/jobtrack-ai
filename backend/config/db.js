const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB Error: MONGO_URI is missing from .env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    console.error(
      "Fix checklist: 1) Atlas Network Access must allow this IP (or 0.0.0.0/0 for dev). 2) MONGO_URI user/password must be correct. 3) Cluster must be running."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
