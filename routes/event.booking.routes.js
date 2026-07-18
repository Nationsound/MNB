const express = require("express");

const router = express.Router();

const eventBookingControllers = require("../controllers/event.booking.controllers");

const { verifyToken } = require("../utils/verifyUser");

const upload = require("../multer");

// CREATE EVENT BOOKING

router.post(

"/mnb/api/eventbooking/create",

verifyToken,

upload.single("paymentProof"),

eventBookingControllers.createEventBooking

);

// USER BOOKINGS

router.get(

"/mnb/api/eventbooking/user",

verifyToken,

eventBookingControllers.getUserEventBookings

);


// ADMIN GET ALL BOOKINGS

router.get(

"/mnb/api/eventbooking/all",

verifyToken,

eventBookingControllers.getAllEventBookings

);


// ADMIN APPROVE PAYMENT

router.put(

"/mnb/api/eventbooking/verify/:id",

verifyToken,

eventBookingControllers.verifyEventPayment

);


// ADMIN REJECT PAYMENT

router.put(

"/mnb/api/eventbooking/reject/:id",

verifyToken,

eventBookingControllers.rejectEventPayment

);


// CHECK IN TICKET

router.put(

"/mnb/api/eventbooking/checkin",

verifyToken,

eventBookingControllers.checkInEventTicket

);


router.get(
"/mnb/api/eventbooking/checked-in",
verifyToken,
eventBookingControllers.getCheckedInGuests
);


module.exports = router;