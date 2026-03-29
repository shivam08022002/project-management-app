const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if the URI is actually being loaded
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the server if connection fails
  }
};

module.exports = connectDB;
