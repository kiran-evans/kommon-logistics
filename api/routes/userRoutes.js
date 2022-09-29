const express = require('express');
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require('../controller/userController');

router.route('/').post(createUser).get(getUser).put(updateUser).delete(deleteUser);
router.route('/login').post(loginUser);

module.exports = router;