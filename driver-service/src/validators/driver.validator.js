const Joi = require('joi');
const { ApiError } = require('../utils/ApiError');

const createDriverSchema = Joi.object({
  userId: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).required(),
  phone: Joi.string().trim().min(7).required(),
  licenseNumber: Joi.string().trim().required(),
  vehicle: Joi.object({
    type: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    plateNumber: Joi.string().trim().required(),
    color: Joi.string().trim().required(),
  }).required(),
});

const updateDriverSchema = Joi.object({
  name: Joi.string().trim().min(2).optional(),
  phone: Joi.string().trim().min(7).optional(),
  licenseNumber: Joi.string().trim().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  vehicle: Joi.object({
    type: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    plateNumber: Joi.string().trim().required(),
    color: Joi.string().trim().required(),
  }).optional(),
}).min(1);

const availabilitySchema = Joi.object({
  isAvailable: Joi.boolean().required(),
});

const validateCreateDriver = (req, res, next) => {
  const { error } = createDriverSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

const validateUpdateDriver = (req, res, next) => {
  const { error } = updateDriverSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

const validateAvailability = (req, res, next) => {
  const { error } = availabilitySchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

module.exports = {
  validateCreateDriver,
  validateUpdateDriver,
  validateAvailability,
};
