// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const reservationRoute = require('./routes/reservationRoute'); // Reservation routes
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User authentication routes
app.use('/api/users', userRoutes);

// Reservation routes
app.use('/api/reservations', reservationRoute);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Reservation API');
});

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
