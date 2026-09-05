const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/uber_rides';
    await mongoose.connect(mongoUri);
    console.log('Ride service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB ride connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
