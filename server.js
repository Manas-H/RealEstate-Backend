const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', require('./src/routes/agentRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));
app.use('/api/properties', require('./src/routes/propertyRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));

// Start the server and save it to a variable
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the server instance for use in testing
module.exports = server;
