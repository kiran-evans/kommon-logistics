const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { User, UserInfo } = require('../model/userSchema');

const createUser = async (req, res) => {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create new user based on userType

      let userInfo = null;
      if (req.body.userInfo) userInfo = new UserInfo(req.body.userInfo); // Only change it from blank if specified in req body

      const newUser = new User({
        userType: req.body.userType.toUpperCase(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        userInfo: userInfo,
      });

      // Respond
      await newUser.save();
      return res.status(201).json(newUser);

    } catch(err) {
        return res.status(500).json({ message: `Failed to create new user ${JSON.stringify(req.body)}. ${err}` });
    }
};

const getUser = async (req, res) => {
  if (JSON.stringify(req.query) === '{}') // No query provided
    return res.status(400).json({ message: `Cannot get user as no query parameters were provided.` });

  if (req.query.id) {
    try {
      const user = await User.findById(req.query.id);
    
      if (!user) {
        return res.status(404).json({ message: `No user found with id=${req.query.id}` });
      }

      const {password, __v, ...userBody} = user._doc;
    
      return res.status(200).json(userBody);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get user with id=${req.query.id}. ${err}` });
    }
  }

  if (req.query.username) {
    try {
      const user = await User.findOne({ username: req.query.username });
    
      if (!user) {
        if (req.query.checkIsUnique) {
          return res.status(200).json({ isUnique: true });
        }
        return res.status(404).json({ message: `No user found with username=${req.query.username}` });
      }

      const {password, __v, ...userBody} = user._doc;
    
      return res.status(200).json(userBody);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get user with username=${req.query.username}. ${err}` });
    }
  }

  if (req.query.email) {
    try {
      const user = await User.findOne({ email: req.query.email });
    
      if (!user) {
        return res.status(404).json({ message: `No user found with email=${req.query.email}` });
      }

      const {password, __v, ...userBody} = user._doc;
    
      return res.status(200).json(userBody);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get user with email=${req.query.email}. ${err}` });
    }
  }

  if (req.query.userType) {
    try {
      const users = await User.find({ userType: req.query.userType.toUpperCase() });
      
      if (users.length === 0) return res.status(404).json({ message: `No users found with userType=${req.query.userType}` });

      let userBodies = [];
      users.forEach(user => {
        const {password, __v, ...userBody} = user._doc;
        userBodies.push(userBody);
      })
  
      return res.status(200).json(userBodies);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get users with userType=${req.query.userType}. ${err}` });
    }
  }

  return res.status(400).json({ message: `Could not get any user(s) because ${JSON.stringify(req.query)} is not a valid query.` });
};

const updateUser = async (req, res) => {

  try {
    const user = await User.findById(req.query.id);
  
    if (!user) {
      return res.status(404).json({ message: `Cannot update user as no user found with id=${req.query.id}` });
    }

    if (req.body.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }

    const updateSchema = await User.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, }
    );

    const { password, __v, ...newBody } = updateSchema._doc;
    
    return res.status(200).json(newBody);

  } catch (err) {
    return res.status(500).json({ message: `Failed to update user. ${err}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (!user) {
      return res.status(404).json({ message: `Cannot delete user as no user found with id=${req.query.id}` });
    }
  
    await user.remove();
  
    return res.status(204).json(`Deleted user ${req.query.id}`);

  } catch (err) {
    return res.status(500).json({ message: `Failed to delete user. ${err}` });
  }
};

// Login
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ // Find by username
            username: req.body.username
        });

        if (!user) {
          return res.status(404).json({ message: "There was no account found with that username." });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password); // Check pw

        if (!validPassword) {
          return res.status(400).json({ message: "The password you entered was not correct." });
        }

        const {password, __v, ...other} = user._doc; // Exclude these fields from the response

        return res.status(200).json(other);

    } catch(err) {
        return res.status(500).json({ message: `Failed to auth user ${JSON.stringify(req.body)}. ${err}` });
    }
};

// Reset password

const generateResetLink = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: `No user found with email=${req.body.email}` });
  
    const salt = await bcrypt.genSalt(10);
    const token = await bcrypt.hash(JSON.stringify(user._id), salt);

    await User.findByIdAndUpdate(user._id, { // Save the token in the user account
      token: token,
    });

    const resetLink = `${process.env.CLIENT_URL}/password-reset?t=${encodeURIComponent(token)}&u=${user._id}`;
  
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: req.body.email,
      subject: `Password Reset`,
      html: `<p>You have been sent this email as you recently requested to reset your password.</p>
      <p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a>.</p>
      <p>If you did not request to reset your password, contact your system administrator immediately.</p>`
    }
  
    try {
      await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: `Failed to send email. ${error}` });
      return res.status(200).json({ message: `Email sent. ${info.response}` });
      });
      return res.status(200).json(res.data);
    } catch (err) {
      return res.status(500).json({ message: `Failed to send email. ${err}` });
    }

  } catch (err) {
    return res.status(500).json({ message: `Failed to generate reset link. ${err}` });
  }
}

const validateResetLink = async (req, res) => {
  try {
    const validUser = await User.findOne({ token: decodeURIComponent(req.query.t) });
    if (!validUser) return res.status(400).json({ message: `That link did not work.` });

    await User.findByIdAndUpdate(req.query.u, { token: null });

    return res.status(200).json({ message: `Email validated.` });
  } catch (err) {
    return res.status(500).json({ message: `Failed to validate email. ${err}` });
  }
}

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  generateResetLink,
  validateResetLink
};