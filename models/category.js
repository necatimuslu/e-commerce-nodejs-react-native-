const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#333",
  },
  icon: {
    type: String,
    default: "pi-check",
  },
  image: {
    type: String,
    default: "",
  },
});
exports.Category = mongoose.model("category", categorySchema);
