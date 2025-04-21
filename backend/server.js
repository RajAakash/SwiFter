const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const cron = require('node-cron');
const Ride = require('./models/Ride');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/swifter');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
});

app.set('io', io);

// Routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/ride');
const driverRoutes = require('./routes/driver');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('Ride Sharing Backend is running!');
});

//Cancel ride if the ride is 2 hours past the booking time in every 10mins
// Runs every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  const now = new Date();

  try {
    // Cancel rides that are over 2 hours past bookingTime and still not completed
    const updated = await Ride.updateMany(
      {
        bookingTime: { $lt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
        status: { $in: ['booked', 'accepted'] },
      },
      { $set: { status: 'cancelled' } }
    );

    console.log(`Auto-cancelled ${updated.modifiedCount} old rides.`);
  } catch (err) {
    console.error('Error in cron job:', err.message);
  }
});

server.listen(3000, '0.0.0.0', () =>
  console.log('Server running on port 3000')
);
