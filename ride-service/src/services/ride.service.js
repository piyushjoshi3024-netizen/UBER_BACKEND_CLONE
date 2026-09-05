const axios = require('axios');
const Ride = require('../models/ride.model');
const { ApiError } = require('../utils/ApiError');
const { calculateFare } = require('./fare.service');
const { redisClient } = require('../config/redis');

const validTransitions = {
  requested: ['accepted', 'cancelled'],
  accepted: ['driver_arriving', 'cancelled'],
  driver_arriving: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

class RideService {
  async getCachedRide(rideId) {
    if (!redisClient.isOpen) {
      return null;
    }

    try {
      return await redisClient.get(`ride:${rideId}`);
    } catch (error) {
      console.error('Redis get failed:', error.message);
      return null;
    }
  }

  async setCachedRide(rideId, rideData) {
    if (!redisClient.isOpen) {
      return;
    }

    try {
      await redisClient.set(`ride:${rideId}`, JSON.stringify(rideData), { EX: 300 });
    } catch (error) {
      console.error('Redis set failed:', error.message);
    }
  }

  async createRide(payload, requester) {
    const { riderId, pickup, destination } = payload;

    if (!riderId) {
      throw new ApiError('riderId is required', 400);
    }

    if (requester.userId !== riderId) {
      throw new ApiError('Forbidden: you can only request rides for yourself', 403);
    }

    if (!pickup || !destination) {
      throw new ApiError('pickup and destination are required', 400);
    }

    const distanceKm = Number(payload.distanceKm || 5);
    const durationMinutes = Number(payload.durationMinutes || 10);

    const driverServiceUrl = process.env.DRIVER_SERVICE_URL || 'http://localhost:4003';
    const response = await axios.get(`${driverServiceUrl}/api/drivers/available`);
    const availableDrivers = response.data?.data || [];

    if (!availableDrivers.length) {
      throw new ApiError('No available drivers at the moment', 404);
    }

    const selectedDriver = availableDrivers[0];
    const fare = calculateFare({ distanceKm, durationMinutes });

    const ride = await Ride.create({
      riderId,
      driverId: selectedDriver._id,
      pickup,
      destination,
      fare,
      distance: distanceKm,
      status: 'requested',
      requestedAt: new Date(),
    });

    await this.setCachedRide(ride._id, ride.toObject());

    return ride;
  }

  async getRideById(rideId) {
    const cachedRide = await this.getCachedRide(rideId);
    if (cachedRide) {
      return JSON.parse(cachedRide);
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new ApiError('Ride not found', 404);
    }

    await this.setCachedRide(rideId, ride.toObject());

    return ride;
  }

  async getRidesByUser(userId) {
    return Ride.find({ riderId: userId }).sort({ requestedAt: -1 });
  }

  async getRidesByDriver(driverId) {
    return Ride.find({ driverId }).sort({ requestedAt: -1 });
  }

  async transitionRide(rideId, targetStatus, actor, actorRole) {
    const ride = await this.getRideById(rideId);

    if (!ride) {
      throw new ApiError('Ride not found', 404);
    }

    const currentStatus = ride.status;
    const allowedNext = validTransitions[currentStatus] || [];

    if (!allowedNext.includes(targetStatus)) {
      throw new ApiError(`Invalid ride transition from ${currentStatus} to ${targetStatus}`, 400);
    }

    if (targetStatus === 'accepted') {
      if (actorRole !== 'driver' || actor.userId !== ride.driverId) {
        throw new ApiError('Only the assigned driver can accept this ride', 403);
      }
      ride.acceptedAt = new Date();
    }

    if (targetStatus === 'driver_arriving') {
      if (actorRole !== 'driver' || actor.userId !== ride.driverId) {
        throw new ApiError('Only the assigned driver can set driver arriving', 403);
      }
    }

    if (targetStatus === 'in_progress') {
      if (actorRole !== 'driver' || actor.userId !== ride.driverId) {
        throw new ApiError('Only the assigned driver can start the ride', 403);
      }
      ride.startedAt = new Date();
    }

    if (targetStatus === 'completed') {
      if (actorRole !== 'driver' || actor.userId !== ride.driverId) {
        throw new ApiError('Only the assigned driver can complete this ride', 403);
      }
      ride.completedAt = new Date();
    }

    if (targetStatus === 'cancelled') {
      if (actorRole !== 'rider' && actorRole !== 'driver') {
        throw new ApiError('Only rider or driver can cancel this ride', 403);
      }
      if (actorRole === 'rider' && actor.userId !== ride.riderId) {
        throw new ApiError('Only the rider can cancel this ride', 403);
      }
      if (actorRole === 'driver' && actor.userId !== ride.driverId) {
        throw new ApiError('Only the assigned driver can cancel this ride', 403);
      }
      ride.cancelledAt = new Date();
    }

    ride.status = targetStatus;
    await ride.save();

    await this.setCachedRide(rideId, ride.toObject());

    return ride;
  }
}

module.exports = new RideService();
