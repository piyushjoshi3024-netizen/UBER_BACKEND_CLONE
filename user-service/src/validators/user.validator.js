const Joi = require('joi');
const { ApiError } = require('../utils/ApiError');

const createUserSchema = Joi.object({
  authUserId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(7).required(),
  role: Joi.string().valid('rider', 'driver', 'admin').optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).optional(),
  phone: Joi.string().trim().min(7).optional(),
  profileImage: Joi.string().trim().optional(),
}).min(1);

const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
