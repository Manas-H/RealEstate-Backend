const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    interestedClients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    images: [{ type: String }],  
    propertyType: { type: String },  
    status: { type: String, default: "available" },  
    geoLocation: { 
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });  

module.exports = mongoose.model('Property', PropertySchema);
