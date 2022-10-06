const bcrypt = require('bcrypt');
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
    
      return res.status(200).json(user);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get user with id=${req.query.id}. ${err}` });
    }
  }

  if (req.query.username) {
    try {
      const user = await User.findOne({ username: req.query.username });
    
      if (!user) {
        return res.status(404).json({ message: `No user found with username=${req.query.username}` });
      }
    
      return res.status(200).json(user);
  
    } catch (err) {
      return res.status(500).json({ message: `Failed to get user with username=${req.query.username}. ${err}` });
    }
  }

  if (req.query.userType) {
    try {
      const users = await User.find({ userType: req.query.userType.toUpperCase() });
      
      if (users.length === 0) return res.status(404).json({ message: `No users found with userType=${req.query.userType}` });
  
      return res.status(200).json(users);
  
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

    let newBody = req.body;

    if (newBody.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      newBody.password = hashedPassword;
    }

    const updateSchema = await User.findByIdAndUpdate(
      req.query.id,
      newBody,
      { new: true, }
    );
    
    return res.status(200).json(updateSchema);

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

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};