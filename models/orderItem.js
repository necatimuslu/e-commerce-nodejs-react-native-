const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

exports.OrderItem = mongoose.model("orderItem", orderItemSchema);
