const express = require('express');
const { searchProperties, interestProperty, getInterestedProperties } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/properties').get(searchProperties);
router.route('/properties/:id/interest').post(protect, interestProperty);
router.route('/interests').get(protect, getInterestedProperties);

module.exports = router;
