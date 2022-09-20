const Delivery = require('../model/deliverySchema');

const getAllDeliverys = async (req, res) => {
  const delivery = await Delivery.find();
  res.status(200).json(delivery);
};

const getDeliveryByID = async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  res.status(200).json(delivery);
};

const createDelivery = async (req, res) => {
    try {
        // Create new user
        const newDelivery = new Delivery({
            location: req.body.location,
            weight: req.body.weight,
            dateAdded: req.body.dateAdded,
        });

        // Respond
        const delivery = await newDelivery.save();
        res.status(201).json(newDelivery);

    } catch(err) {
        console.log("ERROR: Failed to create new delivery.");
        return res.status(500).json(err);
    }
};

const updateDelivery = async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    res.status(400).json({ message: `delivery not found` });
  }

  const updateSchema = await Delivery.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateSchema);
};

const deleteDelivery = async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.status(204).json({ id: req.params.id });
};

module.exports = {
  getAllDeliverys,
  getDeliveryByID,
  createDelivery,
  updateDelivery,
  deleteDelivery,
};