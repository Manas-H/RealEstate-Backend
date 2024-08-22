const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    interestedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    images: [{ type: String }],  // Add an array of image URLs
    propertyType: { type: String },  // E.g., "House", "Apartment", etc.
    status: { type: String, default: "available" },  // "available", "sold", etc.
    geoLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
}, { timestamps: true });  // Add timestamps to schema

module.exports = mongoose.model('Property', PropertySchema);
