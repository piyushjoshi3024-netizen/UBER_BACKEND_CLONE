require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4003;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Driver service running on port ${PORT}`);
  });
};

startServer();
