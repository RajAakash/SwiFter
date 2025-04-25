const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ride = require('../models/Ride');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, password: hash });
  await user.save();
  res.send({ success: true, message: 'Signup successful' });
});

router.post('/login', async (req, res) => {
  try {
    console.log('Incoming login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, 'SECRET');
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Error in /login:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

//get user profile
router.get('/user/:userId/profile', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('name email'); // Add more fields as needed
    console.log('here is the userId that is used', user);

    const totalRides = await Ride.countDocuments({ userId });
    const completedRides = await Ride.countDocuments({
      userId,
      status: 'completed',
    });
    const cancelledRides = await Ride.countDocuments({
      userId,
      status: 'cancelled',
    });

    res.send({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        totalRides,
        completedRides,
        cancelledRides,
      },
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

//  router.post('/logout', async (req, res) => { });

module.exports = router;
