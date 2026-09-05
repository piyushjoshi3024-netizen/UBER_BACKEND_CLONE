const authService = require('../services/auth.service');
const { successResponse } = require('../../../shared/response');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, 'Login successful', 200);
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body);
    return successResponse(res, result, 'Token refreshed successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.user.userId);
    return successResponse(res, result, 'Logout successful', 200);
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.userId);
    return successResponse(res, result, 'Current user fetched', 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
