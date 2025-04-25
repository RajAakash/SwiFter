const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');

// POST /api/driver/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, vehicle, license, password } = req.body;
    if (!name || !email || !phone || !vehicle || !license || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = new Driver({
      name,
      email,
      phone,
      vehicle,
      license,
      password: hashedPassword,
    });

    await newDriver.save();

    const token = jwt.sign({ id: newDriver._id }, 'DRIVER_SECRET', {
      expiresIn: '1d',
    });

    res.status(201).json({
      success: true,
      token,
      driver: {
        _id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
      },
    });
  } catch (err) {
    console.error('Driver signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/driver/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('email, password of the driver', email, password);
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: 'Driver not found' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: driver._id }, 'DRIVER_SECRET', {
      expiresIn: '1d',
    });

    return res.json({
      success: true,
      token,
      driver: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
      },
    });
  } catch (error) {
    console.error('Driver login error:', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

// Get all rides assigned to a driver that are upcoming
router.get('/driver/:driverId', async (req, res) => {
  try {
    const now = new Date();
    const rides = await Ride.find({
      driverId: req.params.driverId,
      bookingTime: { $gt: now },
      status: { $in: ['booked', 'accepted'] },
    });

    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
