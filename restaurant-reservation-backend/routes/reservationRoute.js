const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/UserControllers'); // Protect middleware
const reservationController = require('../controllers/reservationController'); // Ensure this path is correct

// Create a reservation
router.post('/create', protect, reservationController.createReservation);

// Get user reservations
router.get('/', protect, reservationController.getUserReservations);

// Update reservation
// Update reservation (Include reservation ID in the URL)
router.put('/update/:id', protect, reservationController.updateReservation);

// Delete reservation
router.delete('/:id', protect, reservationController.deleteReservation);

// Check if the table is reserved

// Get all reservations

module.exports = router;
