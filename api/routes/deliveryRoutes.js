const express = require('express');
const router = express.Router();
const {
  getAllDeliverys,
  getDeliveryByID,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require('../controller/deliveryController');

router.route('/').get(getAllDeliverys).post(createDelivery);
router.route('/:id').delete(deleteDelivery).put(updateDelivery).get(getDeliveryByID);

module.exports = router;