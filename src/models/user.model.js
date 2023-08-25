const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userModel);

module.exports = User;
