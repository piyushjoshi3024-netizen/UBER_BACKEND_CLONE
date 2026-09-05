const express = require('express');
const { register, login, refresh, logout, me } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin, validateRefresh } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', validateRefresh, refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
