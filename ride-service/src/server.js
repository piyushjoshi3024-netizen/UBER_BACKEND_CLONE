require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 4004;

const startServer = async () => {
  await connectDB();
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Ride service running on port ${PORT}`);
  });
};

startServer();
