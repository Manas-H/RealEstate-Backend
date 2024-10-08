// propertyController.js
const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().select('-interestedClients');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).select('-interestedClients'); 
        if (property) {
            // console.log(property)
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
