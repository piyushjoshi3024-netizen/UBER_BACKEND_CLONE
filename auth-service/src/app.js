const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRateLimiter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'auth-service',
    message: 'Auth service is healthy',
  });
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;
