const EventBooking = require("../models/eventBookings");
const Event = require("../models/eventSchema");
const QRCode = require("qrcode");
const errorHandler = require("../utils/error");
const {
sendTicketReadyNotification
}=require("../utils/notifications");

const {
  sendNewBookingNotification
}=require("../utils/organizerNotifications");

const {
cloudinary,
uploadBufferToCloudinary
}=require("../utils/cloudinary");



// CREATE EVENT BOOKING

const createEventBooking = async(req,res,next)=>{

try{

const {

eventId,
paymentReference

}=req.body;

const tickets =
JSON.parse(req.body.tickets);

const event =
await Event.findById(eventId);

if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}

let totalAmount=0;

tickets.forEach(ticket=>{

const eventTicket =
event.ticketTypes.find(

item=>item.name===ticket.ticketType

);

if(!eventTicket){

throw new Error(
`Ticket type ${ticket.ticketType} not found`
);

}

if(

eventTicket.quantity -
eventTicket.sold <
ticket.quantity

){

throw new Error(
`Not enough ${ticket.ticketType} tickets available`
);

}

totalAmount +=

eventTicket.price *
ticket.quantity;

});



let paymentProof="";

let paymentProofPublicId="";

if(req.file){

const uploaded =
await uploadBufferToCloudinary(
req.file.buffer
);

paymentProof =
uploaded.secure_url;

paymentProofPublicId =
uploaded.public_id;

}



const booking =
await EventBooking.create({

user:req.user.id,

event:eventId,

tickets,

totalAmount,

paymentMethod:"bank_transfer",

paymentReference,

paymentProof,

paymentProofPublicId,

paymentStatus:"pending",

bookingStatus:"pending"

});

await sendNewBookingNotification(
event.organizer.email,
event.title,
totalAmount
);

res.status(201).json({

success:true,

message:"Booking submitted successfully.",

booking

});

}catch(error){

next(error);

}

};



// USER BOOKINGS

const getUserEventBookings = async(req,res,next)=>{

try{

const bookings =
await EventBooking.find({

user:req.user.id

})

.populate("event")

.sort({

createdAt:-1

});

res.status(200).json(bookings);

}catch(error){

next(error);

}

};



// ADMIN BOOKINGS

const getAllEventBookings = async(req,res,next)=>{

try{

const bookings =
await EventBooking.find()

.populate(
"user",
"firstName middleName lastName email"
)

.populate(
"event",
"title date venue imageUrl"
)

.sort({

createdAt:-1

});

res.status(200).json(bookings);

}catch(error){

next(error);

}

};




// VERIFY PAYMENT

const verifyEventPayment = async(req,res,next)=>{

try{


const booking = await EventBooking.findById(
req.params.id
)
.populate("event")
.populate(
"user",
"email firstName middleName lastName"
);



if(!booking){

return next(
errorHandler(
404,
"Booking not found"
)
);

}




// Prevent duplicate approval

if(
booking.paymentStatus === "paid"
){

return next(
errorHandler(
400,
"Booking already verified"
)
);

}





// Update sold tickets

for(const bookedTicket of booking.tickets){


const ticket =
booking.event.ticketTypes.find(

item =>
item.name === bookedTicket.ticketType

);



if(ticket){

ticket.sold += bookedTicket.quantity;

}


}



await booking.event.save();







// Generate ticket number

const eventCode = booking.event.title
.split(" ")
.map(word => word.substring(0,4))
.join("")
.substring(0,4)
.toUpperCase();


const ticketNumber =
`MNB-${eventCode}-${Date.now().toString().slice(-6)}`;


booking.ticketNumber = ticketNumber;







// QR contains only verification data

const qrData = JSON.stringify({

bookingId:
booking._id.toString(),

ticketNumber

});






const qrCodeImage =
await QRCode.toDataURL(
qrData
);




booking.qrCode =
qrCodeImage;








// Confirm booking

booking.paymentStatus =
"paid";


booking.bookingStatus =
"confirmed";



booking.verifiedBy =
req.user.id;


booking.verifiedAt =
new Date();






await booking.save();


try{


await sendTicketReadyNotification(

booking.user.email,

booking.event,

booking.ticketNumber

);


}catch(emailError){


console.log(

"TICKET EMAIL ERROR:",

emailError.message

);


}






res.status(200).json({

success:true,

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

success:true,

message:"Payment rejected",

booking

});

}catch(error){

next(error);

}

};



// CHECK IN EVENT TICKET

const checkInEventTicket = async (req, res, next) => {
  try {
    const { ticketNumber } = req.body;

    if (!ticketNumber) {
      return next(
        errorHandler(400, "Ticket number is required")
      );
    }

    let booking = await EventBooking.findOne({
      ticketNumber,
    })
      .populate({
        path: "user",
        select: "firstName middleName lastName email",
      })
      .populate({
        path: "event",
        select: "title date venue",
      });

    if (!booking) {
      return next(
        errorHandler(404, "Ticket not found")
      );
    }

    if (
      booking.paymentStatus !== "paid" ||
      booking.bookingStatus !== "confirmed"
    ) {
      return next(
        errorHandler(400, "Ticket is not valid")
      );
    }

    if (booking.checkedIn) {
      return next(
        errorHandler(400, "Ticket already checked in")
      );
    }

    booking.checkedIn = true;
    booking.checkedInAt = new Date();

    await booking.save();

    // Reload booking with populated user and event
    booking = await EventBooking.findById(booking._id)
      .populate({
        path: "user",
        select: "firstName middleName lastName email",
      })
      .populate({
        path: "event",
        select: "title date venue",
      });

    console.log("CHECK IN USER:", booking.user);

    res.status(200).json({
      success: true,
      message: "Entry approved",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// CHECKED IN GUESTS HISTORY

const getCheckedInGuests = async(req,res,next)=>{

try{


const guests = await EventBooking.find({

checkedIn:true

})

.populate({

path:"user",

select:"firstName middleName lastName email"

})

.populate({

path:"event",

select:"title date venue imageUrl"

})

.sort({

checkedInAt:-1

});



res.status(200).json({

success:true,

guests

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

rejectEventPayment,

checkInEventTicket,

getCheckedInGuests

};