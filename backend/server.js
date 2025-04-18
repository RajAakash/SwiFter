const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

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
server.listen(3000, '0.0.0.0', () =>
  console.log('Server running on port 3000')
);
