const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const Client = require("../models/Client");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");

dotenv.config();

// Generate token including id and role
const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const handleRegistration = async (model, req, res) => {
  try {
    const { name, email, number, password, licenseNumber, role } = req.body;
    
    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new user based on the model (Agent or Client)
    const user = await model.create({
      name,
      email,
      number,
      password,
      ...(licenseNumber ? { licenseNumber } : {}),
      role: role || "client",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      role: user.role, // Ensure role is included in response
      token: generateToken(user._id, user.role), // Include role in the token
    });
    console.log("Registration successful");
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    } else {
      // Handle other errors
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
};

exports.registerAgent = (req, res) => handleRegistration(Agent, req, res);
exports.registerClient = (req, res) => handleRegistration(Client, req, res);

const handleLogin = async (model, req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      console.log("Email or password not provided");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await model.findOne({ email });

    // Check if user exists
    if (!user) {
      console.log("No user found with the provided email");
      return res.status(401).json({ message: "Invalid email" });
    }

    // Check if the password is correct
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token and respond with user info
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      role: user.role, // Include role in the response
      token: generateToken(user._id, user.role, user.name), 
    });
    console.log("Login successful");
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Respond with user details
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      number: req.user.number,
      role: req.user.role,
      ...(req.user.licenseNumber
        ? { licenseNumber: req.user.licenseNumber }
        : {}),
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginAgent = (req, res) => handleLogin(Agent, req, res);
exports.loginClient = (req, res) => handleLogin(Client, req, res);
