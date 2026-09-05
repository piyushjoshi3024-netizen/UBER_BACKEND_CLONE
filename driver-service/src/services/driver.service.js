const Driver = require('../models/driver.model');
const { ApiError } = require('../utils/ApiError');

class DriverService {
  async createDriver(payload, requester) {
    const { userId, name, phone, licenseNumber, vehicle } = payload;

    if (!userId || !name || !phone || !licenseNumber || !vehicle) {
      throw new ApiError('userId, name, phone, licenseNumber, and vehicle are required', 400);
    }

    if (requester.role !== 'admin' && requester.userId !== userId) {
      throw new ApiError('Forbidden: cannot create a driver profile for another user', 403);
    }

    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      throw new ApiError('Driver profile already exists', 409);
    }

    const driver = await Driver.create({
      userId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      licenseNumber: String(licenseNumber).trim(),
      vehicle: {
        type: String(vehicle.type).trim(),
        model: String(vehicle.model).trim(),
        plateNumber: String(vehicle.plateNumber).trim(),
        color: String(vehicle.color).trim(),
      },
      isAvailable: false,
      isOnline: false,
      rating: 0,
      totalRides: 0,
      isBlocked: false,
    });

    return driver;
  }

  async getDriverById(driverId) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    return driver;
  }

  async getAvailableDrivers() {
    return Driver.find({
      isAvailable: true,
      isOnline: true,
      isBlocked: false,
    }).sort({ rating: -1, createdAt: 1 });
  }

  async updateDriver(driverId, updatePayload, requester) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== driver.userId) {
      throw new ApiError('Forbidden: cannot update this driver', 403);
    }

    const allowedFields = ['name', 'phone', 'licenseNumber', 'vehicle', 'latitude', 'longitude'];
    const updates = {};

    Object.keys(updatePayload).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = updatePayload[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      throw new ApiError('No valid fields provided to update', 400);
    }

    Object.assign(driver, updates);
    await driver.save();

    return driver;
  }

  async deleteDriver(driverId, requester) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== driver.userId) {
      throw new ApiError('Forbidden: cannot delete this driver', 403);
    }

    await driver.deleteOne();

    return { message: 'Driver deleted successfully' };
  }

  async setOnline(driverId, requester) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== driver.userId) {
      throw new ApiError('Forbidden: cannot change this driver status', 403);
    }

    driver.isOnline = true;
    driver.isAvailable = true;
    await driver.save();

    return driver;
  }

  async setOffline(driverId, requester) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== driver.userId) {
      throw new ApiError('Forbidden: cannot change this driver status', 403);
    }

    driver.isOnline = false;
    driver.isAvailable = false;
    await driver.save();

    return driver;
  }

  async updateAvailability(driverId, isAvailable, requester) {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new ApiError('Driver not found', 404);
    }

    if (requester.role !== 'admin' && requester.userId !== driver.userId) {
      throw new ApiError('Forbidden: cannot change this driver availability', 403);
    }

    driver.isAvailable = Boolean(isAvailable);
    if (!driver.isAvailable) {
      driver.isOnline = false;
    }
    await driver.save();

    return driver;
  }
}

module.exports = new DriverService();
