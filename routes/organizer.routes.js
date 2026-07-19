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






module.exports = router;