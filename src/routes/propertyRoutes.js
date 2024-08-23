// propertyRoutes.js
const express = require('express');
const { getAllProperties, getPropertyById } = require('../controllers/propertyController');

const router = express.Router();

router.route('/').get(getAllProperties);  
router.route('/:id').get(getPropertyById); 

module.exports = router;
