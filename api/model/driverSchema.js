const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
  username: {
    unique: true,
    type: String,
    required: true,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    min: 10,
  },
  name: {
    type: String,
    required: true,
  },
  maxCarryWeight: {
    type: Number,
    required: true,
    min: 10,
    max: 2000,
  },
  assignedDeliveries: {
    type: Array,
    required: false,
    min: 0,
  }
});
module.exports = mongoose.model('driver', driverSchema);