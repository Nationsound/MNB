const express = require("express");

const router = express.Router();


const organizerController =
require("../controllers/organizer.controllers.js");


const {
verifyToken
} = require("../utils/verifyUser");





// Organizer Registration

router.post(

"/mnb/api/organizer/register",

organizerController.registerOrganizer

);






// Get Organizer Profile

router.get(

"/mnb/api/organizer/profile",

verifyToken,
 
organizerController.getOrganizerProfile

);






// Get Organizer Dashboard

router.get(

"/mnb/api/organizer/dashboard",

verifyToken,

organizerController.getOrganizerDashboard

);

// Get Organizer Bookings

router.get(

"/mnb/api/organizer/bookings",

verifyToken,

organizerController.getOrganizerBookings

);

// UPDATE ORGANIZER PROFILE

router.put(

"/mnb/api/organizer/update-profile",

verifyToken,

organizerController.updateOrganizerProfile

);


// CHANGE PASSWORD

router.put(

"/mnb/api/organizer/change-password",

verifyToken,

organizerController.changeOrganizerPassword

);


// DELETE ORGANIZER PROFILE

router.delete(

"/mnb/api/organizer/delete-profile",

verifyToken,

organizerController.deleteOrganizerProfile

);



module.exports = router;