const Joi = require('joi');
const { ApiError } = require('../utils/ApiError');

const rideSchema = Joi.object({
  riderId: Joi.string().trim().required(),
  pickup: Joi.object({
    address: Joi.string().trim().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  destination: Joi.object({
    address: Joi.string().trim().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  distanceKm: Joi.number().min(0).optional(),
  durationMinutes: Joi.number().min(0).optional(),
});

const validateRide = (req, res, next) => {
  const { error } = rideSchema.validate(req.body);

  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }

  return next();
};

module.exports = {
  validateRide,
};
