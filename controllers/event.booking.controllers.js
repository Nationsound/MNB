const EventBooking = require("../models/eventBookings");
const Event = require("../models/eventSchema");
const errorHandler = require("../utils/error");




// CREATE EVENT BOOKING

const createEventBooking = async(req,res,next)=>{


try{


const {
eventId
}=req.body;


const tickets =
JSON.parse(req.body.tickets);



const event = await Event.findById(eventId);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}


let totalAmount = 0;



tickets.forEach(ticket=>{


const eventTicket = event.ticketTypes.find(

item=>item.name === ticket.ticketType

);



if(!eventTicket){

throw new Error(
`Ticket type ${ticket.ticketType} not found`
);

}



if(
eventTicket.quantity - eventTicket.sold < ticket.quantity
){

throw new Error(
`Not enough ${ticket.ticketType} tickets available`
);

}



totalAmount +=
eventTicket.price * ticket.quantity;



});


const booking =
await EventBooking.create({

user:req.user.id,

event:eventId,

tickets,

totalAmount,

paymentMethod:"bank_transfer"


});





res.status(201).json(

booking

);



}catch(error){

next(error);

}


};


// GET USER BOOKINGS


const getUserEventBookings = async(req,res,next)=>{


try{


const bookings = await EventBooking.find({

user:req.user.id

})

.populate(
"event"
)

.sort({

createdAt:-1

});





res.status(200).json(

bookings

);



}catch(error){

next(error);

}


};

// ADMIN GET ALL BOOKINGS


const getAllEventBookings = async(req,res,next)=>{


try{


const bookings = await EventBooking.find()

.populate(
"user",
"name email"
)

.populate(
"event",
"title date venue"
)

.sort({

createdAt:-1

});




res.status(200).json(

bookings

);



}catch(error){

next(error);

}


};


// APPROVE PAYMENT


const verifyEventPayment = async(req,res,next)=>{


try{


const booking = await EventBooking.findById(

req.params.id

);



if(!booking){

return next(
errorHandler(
404,
"Booking not found"
)
);

}


booking.paymentStatus="paid";

booking.bookingStatus="confirmed";

booking.verifiedBy=req.user.id;

booking.verifiedAt=new Date();



await booking.save();




res.status(200).json({

message:
"Payment verified successfully",

booking

});



}catch(error){

next(error);

}


};

// REJECT PAYMENT


const rejectEventPayment = async(req,res,next)=>{


try{


const booking =
await EventBooking.findById(

req.params.id

);



if(!booking){

return next(
errorHandler(
404,
"Booking not found"
)
);

}



booking.paymentStatus="rejected";

booking.bookingStatus="cancelled";


booking.verifiedBy=req.user.id;

booking.verifiedAt=new Date();



await booking.save();



res.status(200).json({

message:
"Payment rejected",

booking

});



}catch(error){

next(error);

}


};







module.exports={

createEventBooking,

getUserEventBookings,

getAllEventBookings,

verifyEventPayment,

rejectEventPayment

};