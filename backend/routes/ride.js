const express = require('express');
const Ride = require('../models/Ride');
const router = express.Router();
const stripe = require('stripe')('sk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

router.post('/book', async (req, res) => {
  try {
    const {
      pickup,
      dropoff,
      pickupCoords,
      dropoffCoords,
      bookingTime,
      userId,
    } = req.body;
    const ride = new Ride({
      pickup,
      dropoff,
      pickupCoords,
      dropoffCoords,
      bookingTime,
      userId,
    });
    await ride.save();
    console.log('This is the backend ride saved', ride);
    res.send({ success: true, ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/update-payment/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const { paymentIntentId, status } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      {
        payment: { paymentIntentId, status },
      },
      { new: true }
    );
    res.send({ success: true, ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const rides = await Ride.find({ driver: null, status: 'pending' });
    res.send({ success: true, rides });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.put('/accept/:rideId', async (req, res) => {
  try {
    const { driverId } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      { driver: driverId, status: 'accepted' },
      { new: true }
    );
    res.send({ success: true, ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.get('/my-rides/:driverId', async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId });
    res.send({ success: true, rides });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

// Cancel a ride
router.put('/cancel/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res
        .status(404)
        .send({ success: false, message: 'Ride not found' });
    }

    if (ride.status === 'cancelled' || ride.status === 'completed') {
      return res
        .status(400)
        .send({ success: false, message: 'Ride cannot be cancelled' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Optional: emit socket event to notify other clients
    const io = req.app.get('io');
    if (io) {
      io.emit('rideCancelled', { rideId: ride._id });
    }

    res.send({ success: true, message: 'Ride cancelled successfully', ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.put('/complete/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      { status: 'completed' },
      { new: true }
    );
    res.send({ success: true, ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

// GET /api/ride/upcoming/:userId
router.get('/upcoming/:userId', async (req, res) => {
  const { userId } = req.params;
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  console.log('Server Time:', now);
  console.log('Filtering for bookingTime >=', twoHoursLater);
  try {
    const rides = await Ride.find({
      userId,
      status: 'booked',
      bookingTime: { $gte: twoHoursLater },
    }).sort({ bookingTime: 1 });

    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ride/history/:userId
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const rides = await Ride.find({
      userId,
      status: { $in: ['completed', 'cancelled'] },
    }).sort({ bookingTime: -1 });

    res.json({ success: true, rides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ride/current-rides
router.get('/current-rides', async (req, res) => {
  console.log('Fetching current rides');
  try {
    const driverId = req.driver.id; // Assuming the driver ID is stored in the JWT

    // Find current active rides for this driver (assuming status "ongoing" for active rides)
    const rides = await Ride.find({ driver: driverId, status: 'ongoing' });

    if (rides.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No current rides' });
    }

    res.status(200).json({ success: true, rides });
  } catch (err) {
    console.error('Error fetching current rides:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//GET /api/rides/user/:userId
router.get('/driver-summary/:driverId', async (req, res) => {
  try {
    const all = await Ride.find({ driver: req.params.driverId });
    const accepted = all.filter((r) => r.status === 'accepted').length;
    const completed = all.filter((r) => r.status === 'completed').length;
    const pending = all.filter((r) => r.status === 'pending').length;

    res.send({
      total: all.length,
      accepted,
      completed,
      pending,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.put('/complete/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      { status: 'completed' },
      { new: true }
    );

    const io = req.app.get('io');
    io.emit('rideCompleted', { rideId: ride._id });

    res.send({ success: true, ride });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'name email')
      .populate('userId', 'name email');
    res.send({ success: true, rides });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.delete('/:rideId', async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.rideId);
    res.send({ success: true, message: 'Ride deleted' });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.params.userId }).sort({
      bookingTime: -1,
    });
    res.send({ success: true, rides });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

// Search rides by pickup location
// Search future rides by pickup location
router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location query is required',
      });
    }

    const now = new Date();

    const rides = await Ride.find({
      pickup: { $regex: new RegExp(location, 'i') }, // Match location
      bookingTime: { $gt: now }, // Only future rides
    });

    res.json({ success: true, rides });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// router.get('/search', async (req, res) => {
//   try {
//     const { location } = req.query;

//     // Only show rides in the future AND that have not been selected by any driver (driverId is null)
//     const rides = await Ride.find({
//       pickup: { $regex: location || '', $options: 'i' },
//       driverId: null,
//       bookingTime: { $gt: new Date() }, // future rides only
//     });

//     res.json({ success: true, rides });
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ success: false, message: 'Failed to search rides' });
//   }
// });

// Assign a ride to a driver
router.patch('/assign/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride)
      return res
        .status(404)
        .json({ success: false, message: 'Ride not found' });

    if (ride.driverId) {
      return res
        .status(400)
        .json({ success: false, message: 'Ride already assigned' });
    }

    ride.driverId = driverId;
    ride.status = 'booked'; // or 'accepted'
    await ride.save();

    res.json({ success: true, ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Example: GET /api/ride/driver/:driverId/upcoming-rides
router.get('/driver/:driverId/upcoming-rides', async (req, res) => {
  try {
    const now = new Date();
    const rides = await Ride.find({
      driverId: req.params.driverId,
      bookingTime: { $gt: now },
      status: { $in: ['booked', 'accepted'] },
    });

    res.json({ success: true, rides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Complete the ride for the driver
router.put('/driver/complete/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride)
      return res
        .status(404)
        .json({ success: false, message: 'Ride not found' });

    if (ride.status === 'completed') {
      return res
        .status(400)
        .json({ success: false, message: 'Ride already completed' });
    }

    ride.status = 'completed';
    await ride.save();

    res.json({ success: true, message: 'Ride marked as completed', ride });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get completed rides for a driver
router.get('/driver/:driverId/completed-rides', async (req, res) => {
  try {
    const { driverId } = req.params;

    const rides = await Ride.find({
      driver: driverId,
      status: 'completed',
    });

    res.send({ success: true, rides });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});
module.exports = router;
