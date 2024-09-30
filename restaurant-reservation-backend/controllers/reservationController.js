const db = require('../models/config');

// Create Reservation
exports.createReservation = (req, res) => {
    const { reservation_date, details, menuItems } = req.body;
    const user_id = req.user.id;

    const total_order_amount = exports.calculateTotal(menuItems || []); // Calculate total amount from menu items

    const sql = 'INSERT INTO reservations (user_id, reservation_date, details, total_order_amount) VALUES (?, ?, ?, ?)';
    db.query(sql, [user_id, reservation_date, details, total_order_amount], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating reservation' });
        res.json({ message: 'Reservation registered successfully', reservationId: result.insertId });
    });
};

// Get User Reservations
exports.getUserReservations = (req, res) => {
    const user_id = req.user.id;
    const sql = 'SELECT * FROM reservations WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching reservations' });
        res.json(results);
    });
};

// Update Reservation
exports.updateReservation = (req, res) => {
    const { reservation_date, details, menuItems } = req.body;
    const reservation_id = req.params.id; // Get reservation_id from URL params
    const user_id = req.user.id;

    const total_order_amount = exports.calculateTotal(menuItems || []); // Calculate total amount for update

    const sql = 'UPDATE reservations SET reservation_date = ?, details = ?, total_order_amount = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [reservation_date, details, total_order_amount, reservation_id, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating reservation' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or not owned by the user' });
        }
        res.json({ message: 'Reservation updated successfully' });
    });
};

// Delete Reservation
exports.deleteReservation = (req, res) => {
    const reservation_id = req.params.id; // Get reservation_id from URL params
    const user_id = req.user.id;

    const sql = 'DELETE FROM reservations WHERE id = ? AND user_id = ?';
    db.query(sql, [reservation_id, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting reservation' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or not owned by the user' });
        }
        res.json({ message: 'Reservation deleted successfully' });
    });
};

// Utility function to calculate total amount based on menu items
exports.calculateTotal = (menuItems) => {
    return menuItems.reduce((total, item) => total + (item.price || 0), 0);
};
