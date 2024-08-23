const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const Client = require('../models/Client');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator'); 

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Shorter expiration
};

const handleRegistration = async (model, req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validation of input data should be done here
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await model.create({ name, email, password });
        res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.registerAgent = (req, res) => handleRegistration(Agent, req, res);
exports.registerClient = (req, res) => handleRegistration(Client, req, res);

const handleLogin = async (model, req, res) => {
    try {
        const { email, password } = req.body;
        const user = await model.findOne({ email });
        if (user && await user.matchPassword(password)) {
            res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginAgent = (req, res) => handleLogin(Agent, req, res);
exports.loginClient = (req, res) => handleLogin(Client, req, res);
