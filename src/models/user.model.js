const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
