// propertyRoutes.js
const express = require('express');
const { getAllProperties, getPropertyById } = require('../controllers/propertyController');

const router = express.Router();

router.route('/properties').get(getAllProperties);  // Public route for all users
router.route('/properties/:id').get(getPropertyById); // Public route for property details

module.exports = router;
