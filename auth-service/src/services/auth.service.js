const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser.model');
const { ApiError } = require('../utils/ApiError');

const getAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const getRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      type: 'refresh',
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

class AuthService {
  async register(payload) {
    const { name, email, password, phone, role = 'rider' } = payload;

    if (!name || !email || !password || !phone) {
      throw new ApiError('Name, email, password, and phone are required', 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await AuthUser.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError('User already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const authUser = await AuthUser.create({
      email: normalizedEmail,
      passwordHash,
      role,
    });

    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:4002';
      const userProfileResponse = await axios.post(`${userServiceUrl}/api/users/internal`, {
        authUserId: authUser._id.toString(),
        name,
        email: normalizedEmail,
        phone,
        role,
      });

      const accessToken = getAccessToken(authUser);
      const refreshToken = getRefreshToken(authUser);

      authUser.refreshToken = refreshToken;
      await authUser.save();

      return {
        user: {
          id: authUser._id,
          name: userProfileResponse.data.data.name,
          email: authUser.email,
          phone: userProfileResponse.data.data.phone,
          role: authUser.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await AuthUser.deleteOne({ _id: authUser._id });
      throw new ApiError('Failed to create user profile', 500);
    }
  }

  async login(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const authUser = await AuthUser.findOne({ email: normalizedEmail });

    if (!authUser) {
      throw new ApiError('Invalid credentials', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, authUser.passwordHash);

    if (!isPasswordCorrect) {
      throw new ApiError('Invalid credentials', 401);
    }

    const accessToken = getAccessToken(authUser);
    const refreshToken = getRefreshToken(authUser);

    authUser.refreshToken = refreshToken;
    authUser.lastLoginAt = new Date();
    await authUser.save();

    return {
      user: {
        id: authUser._id,
        email: authUser.email,
        role: authUser.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(payload) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new ApiError('Refresh token is required', 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'dev_secret');
    } catch (error) {
      throw new ApiError('Invalid refresh token', 401);
    }

    const authUser = await AuthUser.findById(decoded.userId);

    if (!authUser || authUser.refreshToken !== refreshToken) {
      throw new ApiError('Session expired, please login again', 401);
    }

    const accessToken = getAccessToken(authUser);
    const nextRefreshToken = getRefreshToken(authUser);

    authUser.refreshToken = nextRefreshToken;
    await authUser.save();

    return {
      accessToken,
      refreshToken: nextRefreshToken,
    };
  }

  async logout(userId) {
    const authUser = await AuthUser.findById(userId);

    if (!authUser) {
      throw new ApiError('User not found', 404);
    }

    authUser.refreshToken = '';
    await authUser.save();

    return {
      message: 'Logged out successfully',
    };
  }

  async getCurrentUser(userId) {
    const authUser = await AuthUser.findById(userId);

    if (!authUser) {
      throw new ApiError('User not found', 404);
    }

    return {
      id: authUser._id,
      email: authUser.email,
      role: authUser.role,
    };
  }
}

module.exports = new AuthService();
