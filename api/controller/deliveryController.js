const Delivery = require('../model/deliverySchema');

const createDelivery = async (req, res) => {
    try {
        // Create new user
        const newDelivery = new Delivery({
            location: req.body.location,
            weight: req.body.weight,
            dateAdded: req.body.dateAdded,
        });

        // Respond
        await newDelivery.save();
        return res.status(201).json({ message: `Created new delivery. ${newDelivery}` });

    } catch(err) {
        return res.status(500).json({ message: `Failed to create new delivery. ${err}` });
    }
};

const getDelivery = async (req, res) => {
  if (JSON.stringify(req.query) === '{}') { // No query
    try {
      const delivery = await Delivery.find();
      return res.status(200).json(delivery);

    } catch (err) {
      return res.status(500).json({ message: `Failed to get all deliveries. ${err}` });
    }
  }

  if (req.query.id) {
    try {
      const delivery = await Delivery.findById(req.query.id);

      if (!delivery) {
        return res.status(404).json({ message: `No delivery found with id=${req.query.id}` });
      }

      return res.status(200).json(delivery);

    } catch (err) {
      return res.status(500).json({ message: `Failed to get delivery with id=${req.query.id}. ${err}` });
    }
  }

  if (req.query.assignedDriverId) {
    try {
      const deliveries = await Delivery.find({ assignedDriverId: req.query.assignedDriverId });

      if (!deliveries) {
        return res.status(404).json({ message: `No delivery found with assignedDriverId=${req.query.assignedDriverId}` });
      }

      return res.status(200).json(deliveries);

    } catch (err) {
      return res.status(500).json({ message: `Failed to get delivery with assignedDriverId=${req.query.assignedDriverId}. ${err}` });
    }
  }

  return res.status(400).json({ message: `Could not get delivery because ${JSON.stringify(req.query)} is not a valid query.` });
};

const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.query.id);
  
    if (!delivery) {
      return res.status(404).json({ message: `Could not update delivery because no delivery was found with id=${req.query.id}` });
    }
  
    const updateSchema = await Delivery.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, }
    );
    return res.status(200).json({ message: `Updated delivery. ${updateSchema}` });

  } catch (err) {
    return res.status(500).json({ message: `Failed to update delivery. ${err}` });
  }
};

const deleteDelivery = async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.query.id);
    return res.status(204).json({ message: `Deleted delivery with id=${req.query.id}` });

  } catch (err) {
    return res.status(500).json({ message: `Failed to delete delivery. ${err}` });
  }
};

module.exports = {
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
};