const express = require('express');
const router = express.Router();
const {
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require('../controller/deliveryController');

router.route('/').post(createDelivery).get(getDelivery).put(updateDelivery).delete(deleteDelivery);

module.exports = router;