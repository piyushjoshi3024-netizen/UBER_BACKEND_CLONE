const express = require('express');
const {
  createRide,
  getRideById,
  getRidesByUser,
  getRidesByDriver,
  acceptRide,
  startRide,
  completeRide,
  cancelRide,
} = require('../controllers/ride.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const { validateRide } = require('../validators/ride.validator');

const router = express.Router();

router.post('/', requireAuth, requireRole('rider'), validateRide, createRide);
router.get('/:id', requireAuth, getRideById);
router.get('/user/:userId', requireAuth, getRidesByUser);
router.get('/driver/:driverId', requireAuth, requireRole('driver', 'admin'), getRidesByDriver);
router.patch('/:id/accept', requireAuth, requireRole('driver'), acceptRide);
router.patch('/:id/start', requireAuth, requireRole('driver'), startRide);
router.patch('/:id/complete', requireAuth, requireRole('driver'), completeRide);
router.patch('/:id/cancel', requireAuth, cancelRide);

module.exports = router;
