const Joi = require('joi');
const { ApiError } = require('../utils/ApiError');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().trim().min(7).required(),
  role: Joi.string().valid('rider', 'driver', 'admin').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

const validateRefresh = (req, res, next) => {
  const { error } = refreshSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh,
};
