const express = require('express');
const { registerAgent, registerClient, loginAgent, loginClient, getUserProfile } = require('../controllers/authController');
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/agent/register', registerAgent);
router.post('/agent/login', loginAgent);
router.post('/client/register', registerClient);
router.post('/client/login', loginClient);

router.get("/profile", protect, getUserProfile);

module.exports = router;
