const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth');

// /api/v1/auth/register
router.route('/register').post(register);
// /api/v1/auth/login
router.route('/login').post(login);

module.exports = router;