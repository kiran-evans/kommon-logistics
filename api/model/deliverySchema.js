const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  assignedDriverId: {
    type: String,
    required: true,
    default: "none",
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 2000,
  },
  dateAdded: {
    type: Date,
    required: true,
  }
});
module.exports = mongoose.model('delivery', deliverySchema);