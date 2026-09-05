const express = require('express');
const {
  createDriver,
  getDriverById,
  getAvailableDrivers,
  updateDriver,
  deleteDriver,
  setOnline,
  setOffline,
  updateAvailability,
} = require('../controllers/driver.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const { validateCreateDriver, validateUpdateDriver, validateAvailability } = require('../validators/driver.validator');

const router = express.Router();

router.post('/', requireAuth, requireRole('driver', 'admin'), validateCreateDriver, createDriver);
router.get('/available', requireAuth, getAvailableDrivers);
router.get('/:id', requireAuth, getDriverById);
router.put('/:id', requireAuth, validateUpdateDriver, updateDriver);
router.delete('/:id', requireAuth, deleteDriver);
router.patch('/:id/online', requireAuth, requireRole('driver', 'admin'), setOnline);
router.patch('/:id/offline', requireAuth, requireRole('driver', 'admin'), setOffline);
router.patch('/:id/availability', requireAuth, requireRole('driver', 'admin'), validateAvailability, updateAvailability);

module.exports = router;
