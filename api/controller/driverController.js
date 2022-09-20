const bcrypt = require('bcrypt');
const Driver = require('../model/driverSchema');

const getAllDrivers = async (req, res) => {
  const driver = await Driver.find();
  res.status(200).json(driver);
};

const getDriverByID = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  res.status(200).json(driver);
};

const getDriverByUsername = async (req, res) => {
  const driver = await Driver.findOne(req.params.username);
  res.status(200).json(driver);
};

const createDriver = async (req, res) => {
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newDriver = new Driver({
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            maxCarryWeight: req.body.maxCarryWeight,
        });

        // Respond
        const driver = await newDriver.save();
        res.status(201).json(newDriver);

    } catch(err) {
        console.log("ERROR: Failed to create new user.");
        return res.status(500).json(err);
    }
};

const updateDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(400).json({ message: `driver not found` });
  }

  const updateSchema = await Driver.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateSchema);
};

const deleteDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(400).json({ message: `driver not found` });
  }

  await driver.remove();

  res.status(204).json({ id: req.params.id });
};

// Login
const loginDriver = async (req, res) => {
    try {
        const user = await Driver.findOne({ // Find by username
            username: req.body.username
        });

        if (!user) {
            return res.status(404).json("There was no account found with that username.");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password); // Check pw

        if (!validPassword) {
            return res.status(400).json("The password you entered was not correct.");
        }

        // const {password, __v, ...other} = user.doc;
        // console.log(user);

        return res.status(200).json(user);

    } catch(err) {
        console.log("ERROR: Login failed.");
        return res.status(500).json(err);
    }
};

module.exports = {
  getAllDrivers,
  getDriverByID,
  getDriverByUsername,
  createDriver,
  updateDriver,
  deleteDriver,
  loginDriver,
};