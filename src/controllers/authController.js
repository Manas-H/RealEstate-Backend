const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const Client = require('../models/Client');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerAgent = async (req, res) => {
    const { name, email, password } = req.body;
    const agent = await Agent.create({ name, email, password });
    res.json({ _id: agent._id, name: agent.name, email: agent.email, token: generateToken(agent._id) });
};

exports.registerClient = async (req, res) => {
    const { name, email, password } = req.body;
    const client = await Client.create({ name, email, password });
    res.json({ _id: client._id, name: client.name, email: client.email, token: generateToken(client._id) });
};

exports.loginAgent = async (req, res) => {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });
    if (agent && (await agent.matchPassword(password))) {
        res.json({ _id: agent._id, name: agent.name, email: agent.email, token: generateToken(agent._id) });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

exports.loginClient = async (req, res) => {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (client && (await client.matchPassword(password))) {
        res.json({ _id: client._id, name: client.name, email: client.email, token: generateToken(client._id) });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
