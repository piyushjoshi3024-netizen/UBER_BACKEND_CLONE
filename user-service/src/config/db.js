const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/uber_users';
    await mongoose.connect(mongoUri);
    console.log('User service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB user connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
