const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 3000,
    reconnectStrategy: () => false,
  },
});

client.on('error', (err) => {
  console.error('Redis error:', err.message);
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Ride service connected to Redis');
  } catch (error) {
    console.error('Redis connection failed, continuing without cache:', error.message);
  }
};

module.exports = {
  redisClient: client,
  connectRedis,
};
