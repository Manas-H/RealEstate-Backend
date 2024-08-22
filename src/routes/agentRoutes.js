const express = require('express');
const { getProperties, createProperty, updateProperty, deleteProperty } = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/properties').get(protect, getProperties).post(protect, createProperty);
router.route('/properties/:id').put(protect, updateProperty).delete(protect, deleteProperty);

module.exports = router;
