const rideService = require('../services/ride.service');
const { successResponse } = require('../../../shared/response');

const createRide = async (req, res, next) => {
  try {
    const ride = await rideService.createRide(req.body, req.user);
    return successResponse(res, ride, 'Ride created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const getRideById = async (req, res, next) => {
  try {
    const ride = await rideService.getRideById(req.params.id);
    return successResponse(res, ride, 'Ride fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const getRidesByUser = async (req, res, next) => {
  try {
    const rides = await rideService.getRidesByUser(req.params.userId);
    return successResponse(res, rides, 'User rides fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const getRidesByDriver = async (req, res, next) => {
  try {
    const rides = await rideService.getRidesByDriver(req.params.driverId);
    return successResponse(res, rides, 'Driver rides fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const acceptRide = async (req, res, next) => {
  try {
    const ride = await rideService.transitionRide(req.params.id, 'accepted', req.user, req.user.role);
    return successResponse(res, ride, 'Ride accepted successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const startRide = async (req, res, next) => {
  try {
    const ride = await rideService.transitionRide(req.params.id, 'in_progress', req.user, req.user.role);
    return successResponse(res, ride, 'Ride started successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const completeRide = async (req, res, next) => {
  try {
    const ride = await rideService.transitionRide(req.params.id, 'completed', req.user, req.user.role);
    return successResponse(res, ride, 'Ride completed successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const cancelRide = async (req, res, next) => {
  try {
    const ride = await rideService.transitionRide(req.params.id, 'cancelled', req.user, req.user.role);
    return successResponse(res, ride, 'Ride cancelled successfully', 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRide,
  getRideById,
  getRidesByUser,
  getRidesByDriver,
  acceptRide,
  startRide,
  completeRide,
  cancelRide,
};
