const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const forwardRequest = async (req, res, targetServiceUrl) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetServiceUrl}${req.originalUrl}`,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined,
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const payload = error.response?.data || {
      success: false,
      message: 'Gateway request failed',
    };

    return res.status(statusCode).json(payload);
  }
};

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'api-gateway',
    message: 'Gateway is healthy',
  });
});

app.use('/api/auth', (req, res) => {
  return forwardRequest(req, res, process.env.AUTH_SERVICE_URL);
});

app.use('/api/users', (req, res) => {
  return forwardRequest(req, res, process.env.USER_SERVICE_URL);
});

app.use('/api/drivers', (req, res) => {
  return forwardRequest(req, res, process.env.DRIVER_SERVICE_URL);
});

app.use('/api/rides', (req, res) => {
  return forwardRequest(req, res, process.env.RIDE_SERVICE_URL);
});

app.use((err, req, res, next) => {
  console.error('Gateway error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal gateway error',
  });
});

module.exports = app;
