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
    throw error; // Let the caller handle the error instead of exiting process
  }
};

module.exports = connectDB;
