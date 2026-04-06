const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: String,
    password: String,
    email: String,
    role: {
      type: String,
      enum: ["Admin", "User",],
      default: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
