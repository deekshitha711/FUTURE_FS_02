const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  notes: String,
  status: {
    type: String,
    default: "new"
  }
});

module.exports = mongoose.model("Lead", leadSchema);