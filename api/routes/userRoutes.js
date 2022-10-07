const express = require('express');
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  generateResetLink,
  validateResetLink
} = require('../controller/userController');

router.route('/').post(createUser).get(getUser).put(updateUser).delete(deleteUser);
router.route('/login').post(loginUser);
router.route('/forgotLogin').post(generateResetLink).get(validateResetLink);

module.exports = router;