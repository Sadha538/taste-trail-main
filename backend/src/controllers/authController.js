const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dietaryPreferences, allergies, cuisines } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      dietaryPreferences: dietaryPreferences || [],
      allergies: allergies || [],
      cuisines: cuisines || [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dietaryPreferences: user.dietaryPreferences,
      allergies: user.allergies,
      cuisines: user.cuisines,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        cuisines: user.cuisines,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites', 'title image averageRating');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dietaryPreferences: user.dietaryPreferences,
      allergies: user.allergies,
      cuisines: user.cuisines,
      favorites: user.favorites,
      collections: user.collections,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, dietaryPreferences, allergies, cuisines } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        dietaryPreferences,
        allergies,
        cuisines,
      },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};

