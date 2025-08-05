const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingControllers');
const upload = require('../multer'); // Your Multer config

router.post('/mnb/api/bookings', upload.single('file'), bookingController.createBooking);
router.get('/mnb/api/getAllBookings', bookingController.getAllBookings);
// Delete booking by ID
router.delete('/mnb/api/deleteBooking/:id', bookingController.deleteBooking);

// Update booking by ID
router.put('/mnb/api/updateBooking/:id', bookingController.updateBooking);


module.exports = router;
