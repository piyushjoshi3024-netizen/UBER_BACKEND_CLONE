const userService = require('../services/user.service');
const { successResponse } = require('../../../shared/response');

const createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    return successResponse(res, result, 'User profile created', 201);
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.user.userId);
    return successResponse(res, result, 'Current user profile fetched', 200);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);
    return successResponse(res, result, 'User fetched', 200);
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    return successResponse(res, result, 'Users fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body, req.user);
    return successResponse(res, result, 'User updated successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user);
    return successResponse(res, result, 'User deleted successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const result = await userService.blockUser(req.params.id);
    return successResponse(res, result, 'User blocked successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const result = await userService.unblockUser(req.params.id);
    return successResponse(res, result, 'User unblocked successfully', 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getMe,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
};
