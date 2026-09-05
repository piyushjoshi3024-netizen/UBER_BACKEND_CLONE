const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      default: null,
    },
    pickup: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destination: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    fare: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'driver_arriving', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
