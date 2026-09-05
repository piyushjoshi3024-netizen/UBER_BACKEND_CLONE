const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const driverRoutes = require('./routes/driver.routes');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'driver-service',
    message: 'Driver service is healthy',
  });
});

app.use('/api/drivers', driverRoutes);

app.use(errorMiddleware);

module.exports = app;
