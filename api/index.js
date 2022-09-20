const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ----------------------
//THIS LINE DICTATES WHAT DB YOU USE!
// FOR TESTING -> path: './config/testconfig.env'  // FOR DEV DB -> path: './config/config.env'
const configPath = './config/config.env';
dotenv.config({ path: configPath }); 
// ----------------------

const port = process.env.PORT;

const connectDB = require('./config/db');
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const driverRoutes = require('./routes/driverRoutes');
const managerRoutes = require('./routes/managerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/api/driver', driverRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/delivery', deliveryRoutes);

const server = app.listen(port, () => console.info(`Server started on port ${port}`));

(configPath === './config/config.env') && console.warn("-- WARNING: Running development environment. NOT SAFE FOR TESTING. --");

module.exports = server;