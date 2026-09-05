const express = require('express');
const {
  createUser,
  getMe,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const { validateCreateUser, validateUpdateUser } = require('../validators/user.validator');

const router = express.Router();

router.post('/internal', validateCreateUser, createUser);
router.get('/me', requireAuth, getMe);
router.get('/', requireAuth, requireRole('admin'), getUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, validateUpdateUser, updateUser);
router.delete('/:id', requireAuth, deleteUser);
router.patch('/:id/block', requireAuth, requireRole('admin'), blockUser);
router.patch('/:id/unblock', requireAuth, requireRole('admin'), unblockUser);

module.exports = router;
