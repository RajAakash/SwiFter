const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup: String,
  dropoff: String,
  pickupCoords: Object,
  dropoffCoords: Object,
  bookingTime: Date,

  payment: {
    paymentIntentId: String,
    status: String,
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Driver' if using a separate model
    default: null,
  },

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },

  status: {
    type: String,
    enum: ['booked', 'accepted', 'completed', 'cancelled'],
    default: 'booked',
  },
});

module.exports = mongoose.model('Ride', RideSchema);
