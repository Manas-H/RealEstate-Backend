const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    number: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Assuming a 10-digit number
    },
    password: { type: String, required: true },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+$/, "Please enter a valid license number"], 
    },
    role: { type: String, default: 'agent' } ,
  },
  { timestamps: true }
); // Add timestamps to schema

AgentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Ensure the middleware calls next()
});

AgentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Agent", AgentSchema);
