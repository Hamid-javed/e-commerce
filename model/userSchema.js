const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  number: {
    type: Number,
    // unique: true,
    min: [1000000000, "Number must be at least 10 digits"],
    max: [9999999999, "Number cannot exceed 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  user_type_id: {
    type: Number,
    default: 0,
    min: [0, "User type ID must be a positive number"],
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    }
  ],
  otp: {
    otp: {
      type: Number,
    },
    expireDate: { type: Number },
  },
});


module.exports = mongoose.model("User", userSchema);
