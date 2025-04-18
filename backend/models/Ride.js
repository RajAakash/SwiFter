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
    ref: 'User', // or 'Driver' if separate model
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
});
module.exports = mongoose.model('Ride', RideSchema);
