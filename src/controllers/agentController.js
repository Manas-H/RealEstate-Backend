const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
    const properties = await Property.find({ agent: req.user._id });
    res.json(properties);
};

exports.createProperty = async (req, res) => {
    const { title, description, price, location } = req.body;
    const property = new Property({ title, description, price, location, agent: req.user._id });
    await property.save();
    res.status(201).json(property);
};

exports.updateProperty = async (req, res) => {
    const { title, description, price, location } = req.body;
    const property = await Property.findById(req.params.id);
    if (property.agent.toString() === req.user._id.toString()) {
        property.title = title;
        property.description = description;
        property.price = price;
        property.location = location;
        await property.save();
        res.json(property);
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

exports.deleteProperty = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property.agent.toString() === req.user._id.toString()) {
        await property.remove();
        res.json({ message: 'Property removed' });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};
