const express = require('express');
const { registerAgent, registerClient, loginAgent, loginClient } = require('../controllers/authController');

const router = express.Router();

router.post('/agent/register', registerAgent);
router.post('/agent/login', loginAgent);
router.post('/client/register', registerClient);
router.post('/client/login', loginClient);

module.exports = router;
