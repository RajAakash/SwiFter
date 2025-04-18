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

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
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

module.exports = router;
