const Property = require('../models/Property');

exports.searchProperties = async (req, res) => {
    const { location, price } = req.query;
    const query = {};
    if (location) query.location = location;
    if (price) query.price = { $lte: price };
    const properties = await Property.find(query);
    res.json(properties);
};

exports.interestProperty = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property) {
        property.interestedClients.push(req.user._id);
        await property.save();
        res.json({ message: 'Interest noted' });
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
};

exports.getInterestedProperties = async (req, res) => {
    const properties = await Property.find({ interestedClients: req.user._id });
    res.json(properties);
};
