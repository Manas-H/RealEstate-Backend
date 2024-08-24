const Property = require("../models/Property");

// Get all properties for a specific agent
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user._id });
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching properties" });
  }
};
// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      images,
      propertyType,
      status,
      geoLocation,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location) {
      return res
        .status(400)
        .json({
          message: "Title, description, price, and location are required",
        });
    }

    // Validate geoLocation
    if (
      !geoLocation ||
      typeof geoLocation.lat !== "number" ||
      typeof geoLocation.lng !== "number"
    ) {
      return res.status(400).json({ message: "Invalid geoLocation" });
    }

    // Validate images (Base64 format)
    if (images && Array.isArray(images)) {
      images.forEach((image) => {
        if (!image.startsWith("data:image/")) {
          return res.status(400).json({ message: "Invalid image format" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ message: "Images must be an array of Base64 strings" });
    }

    // Create a new property
    const property = new Property({
      title,
      description,
      price,
      location,
      images, // Array of Base64 strings
      propertyType,
      status,
      geoLocation,
      agent: req.user._id, // Associate with the logged-in agent
    });

    // Save the property to the database
    await property.save();

    // Respond with the created property
    res.status(201).json(property);
    console.log("Successfully created");
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating property" });
  }
};

// Update an existing property
exports.updateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      images,
      propertyType,
      status,
      geoLocation,
    } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.agent.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    // Update the property
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.location = location || property.location;
    property.images = images || property.images;
    property.propertyType = propertyType || property.propertyType;
    property.status = status || property.status;
    property.geoLocation = geoLocation || property.geoLocation;

    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating property" });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.agent.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    // Use deleteOne instead of remove
    await Property.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Property removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting property" });
  }
};
