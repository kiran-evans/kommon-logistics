const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
  maxCarryWeight: {
    type: Number,
    required: true,
    min: 10,
    max: 2000,
  },
  assignedDeliveries: {
    type: Array,
    required: false,
  },
});

const userSchema = mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: {
      values: ['DRIVER', 'MANAGER'],
      message: '{VALUE} is not a valid userType',
    },
  },
  username: {
    unique: true,
    type: String,
    required: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  userInfo: {
    type: userInfoSchema,
    required: false,
    default: null,
  }
});
module.exports = {
  UserInfo: mongoose.model('UserInfo', userInfoSchema),
  User: mongoose.model('User', userSchema),
}