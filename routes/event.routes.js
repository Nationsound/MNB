const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controllers.js");

const { verifyToken } = require("../utils/verifyUser");

const upload = require("../multer.js");




// Create Event

router.post(

"/mnb/api/addEvent",

verifyToken,

upload.fields([

{
name:"image",
maxCount:1
},

{
name:"galleryImages",
maxCount:15
}

]),

eventController.addEvent

);






// Update Event

router.put(

"/mnb/api/updateEvent/:id",

verifyToken,

upload.fields([

{
name:"image",
maxCount:1
},

{
name:"galleryImages",
maxCount:15
}

]),

eventController.updateEvent

);


router.put(
"/mnb/api/updateEventApproval/:id",
verifyToken,
eventController.updateEventApproval
);

// Delete Event

router.delete(

"/mnb/api/deleteEvent/:id",

verifyToken,

eventController.deleteEvent

);




// Get all Events

router.get(

"/mnb/api/getAllEvents",

eventController.getAllEvents

);



// Get Event by ID

router.get(

"/mnb/api/getEventById/:id",

eventController.getEventById

);

router.get(

"/mnb/api/getEvent/:slug",

eventController.getEvent

);




module.exports = router;