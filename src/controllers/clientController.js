const Property = require('../models/Property');

// Search for properties based on location and/or price
exports.searchProperties = async (req, res) => {
    try {
        const { location, price } = req.query;
        const query = {};

        // Add location to query if provided
        if (location) {
            query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive search
        }

        // Add price filter to query if provided
        if (price) {
            const priceValue = parseFloat(price);
            if (isNaN(priceValue)) {
                return res.status(400).json({ message: 'Invalid price format' });
            }
            query.price = { $lte: priceValue };
        }

        // Find properties based on query
        const properties = await Property.find(query);

        // Return results
        res.json(properties);
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Express interest in a property
exports.interestProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Add client to interestedClients if not already present
        if (!property.interestedClients.includes(req.user._id)) {
            property.interestedClients.push(req.user._id);
            await property.save();
        }

        res.json({ message: 'Interest noted' });
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all properties that the client has shown interest in
exports.getInterestedProperties = async (req, res) => {
    try {
        const properties = await Property.find({ interestedClients: req.user._id });

        // Check if any properties are found
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No interested properties found' });
        }

        // Return results
        res.json(properties);
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
