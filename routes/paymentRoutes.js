const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentControllers');

// use the function from the object
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
