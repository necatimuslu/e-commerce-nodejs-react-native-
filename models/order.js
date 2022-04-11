const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItem",
    },
  ],
  shippingAddress1: {
    type: String,
    default: "",
  },
  shippingAddress2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  totalPrice: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  zip: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Pending",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

exports.Order = mongoose.model("order", orderSchema);
