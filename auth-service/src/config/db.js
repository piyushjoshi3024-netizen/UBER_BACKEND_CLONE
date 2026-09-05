const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/uber_auth';
    await mongoose.connect(mongoUri);
    console.log('Auth service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB auth connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
