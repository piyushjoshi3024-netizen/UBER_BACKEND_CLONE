const driverService = require('../services/driver.service');
const { successResponse } = require('../../../shared/response');

const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body, req.user);
    return successResponse(res, driver, 'Driver profile created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return successResponse(res, driver, 'Driver fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const getAvailableDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAvailableDrivers();
    return successResponse(res, drivers, 'Available drivers fetched successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body, req.user);
    return successResponse(res, driver, 'Driver updated successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const result = await driverService.deleteDriver(req.params.id, req.user);
    return successResponse(res, result, 'Driver deleted successfully', 200);
  } catch (error) {
    return next(error);
  }
};

const setOnline = async (req, res, next) => {
  try {
    const driver = await driverService.setOnline(req.params.id, req.user);
    return successResponse(res, driver, 'Driver is now online', 200);
  } catch (error) {
    return next(error);
  }
};

const setOffline = async (req, res, next) => {
  try {
    const driver = await driverService.setOffline(req.params.id, req.user);
    return successResponse(res, driver, 'Driver is now offline', 200);
  } catch (error) {
    return next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const driver = await driverService.updateAvailability(req.params.id, isAvailable, req.user);
    return successResponse(res, driver, 'Driver availability updated', 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDriver,
  getDriverById,
  getAvailableDrivers,
  updateDriver,
  deleteDriver,
  setOnline,
  setOffline,
  updateAvailability,
};
