const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");
const Client = require("../models/Client");
const dotenv = require("dotenv");

dotenv.config();

exports.protect = async (req, res, next) => {
  let token;
  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1].replace(/"/g, "").trim();
      console.log("Extracted Token:", token); // Log the token to ensure it's extracted
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user =
        (await Agent.findById(decoded.id)) ||
        (await Client.findById(decoded.id));
      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("No Authorization Header or Incorrect Format");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
