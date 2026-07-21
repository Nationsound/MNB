const Organizer = require("../models/organizerSchema");
const Auth = require("../models/auth.schema");
const Event = require("../models/eventSchema");
const EventBooking = require("../models/eventBookings");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error");
const {

sendOrganizerApplicationNotification,

sendOrganizerProfileUpdateNotification,

sendOrganizerPasswordChangedNotification,

sendOrganizerDeleteNotification

}=require("../utils/organizerNotifications");





// Organizer Registration

const registerOrganizer = async(
req,
res,
next
)=>{


try{


const {

businessName,
contactName,
email,
phone,
description,
password

}=req.body;





// Check existing account

const existingUser =
await Auth.findOne({
email
});



if(existingUser){

return next(

errorHandler(
400,
"Email already registered"
)

);

}






// Create user account


const hashedPassword =
await bcrypt.hash(
password,
10
);





const user =
await Auth.create({

email,

password:
hashedPassword,

accountType:"organizer",
isAdmin:false

});








// Create organizer profile


const organizer =
await Organizer.create({

user:user._id,

businessName,

contactName,

email,

phone,

description


});

await sendOrganizerApplicationNotification(
email
);




res.status(201).json({

message:
"Organizer application submitted successfully",

organizer

});




}catch(error){


console.log(
"ORGANIZER REGISTER ERROR:",
error
);


next(error);


}



};











// Get Organizer Profile


const getOrganizerProfile = async(
req,
res,
next
)=>{


try{


const organizer =

await Organizer.findOne({

user:req.user.id

}).populate(
"user",
"email"
);



if(!organizer){

return next(

errorHandler(
404,
"Organizer profile not found"
)

);

}



res.status(200).json(
organizer
);



}catch(error){

next(error);

}


};



const getOrganizerDashboard = async(req,res,next)=>{

try{


const organizer =
await Organizer.findOne({

user:req.user.id

});



if(!organizer){

return next(
errorHandler(
404,
"Organizer profile not found"
)
);

}


console.log("EVENT:", Event);
console.log("TYPE:", typeof Event);

// Get organizer events

const events =
await Event.find({

organizerProfile:organizer._id

})
.sort({
createdAt:-1
});

// Total events

const totalEvents =
events.length;





// Calculate tickets sold

let totalTicketsSold = 0;

let revenue = 0;



events.forEach(event=>{


event.ticketTypes.forEach(ticket=>{


totalTicketsSold += ticket.sold || 0;


revenue +=
(ticket.sold || 0) *
(ticket.price || 0);



});


});







res.status(200).json({


organizer:{


_id:organizer._id,

businessName:organizer.businessName,

contactName:organizer.contactName,

email:organizer.email,

phone:organizer.phone,

description:organizer.description,

verificationStatus:
organizer.verificationStatus,


},



stats:{


totalEvents,


totalTicketsSold,


revenue


},



events


});





}catch(error){

next(error);

}


};



// GET ORGANIZER BOOKINGS

const getOrganizerBookings = async(req,res,next)=>{

try{


const organizer =
await Organizer.findOne({

user:req.user.id

});


if(!organizer){

return next(
errorHandler(
404,
"Organizer profile not found"
)
);

}



// Find organizer events

const events =
await Event.find({

organizerProfile:organizer._id

});


const eventIds =
events.map(
event=>event._id
);




// Find bookings

const bookings =
await EventBooking.find({

event:{
$in:eventIds
},

paymentStatus:"paid",

bookingStatus:"confirmed"

})

.populate(
"user",
"email firstName middleName lastName"
)

.populate(
"event",
"title date venue"
)

.sort({

createdAt:-1

});





res.status(200).json({

success:true,

bookings

});



}catch(error){

next(error);

}

};


// UPDATE ORGANIZER PROFILE

const updateOrganizerProfile = async(
req,
res,
next
)=>{


try{


const {

businessName,

contactName,

phone,

description

}=req.body;



const organizer =

await Organizer.findOneAndUpdate(

{

user:req.user.id

},

{

businessName,

contactName,

phone,

description

},

{

new:true

}

);



if(!organizer){

return next(

errorHandler(

404,

"Organizer profile not found"

)

);

}



await sendOrganizerProfileUpdateNotification(
organizer.email
);


res.status(200).json({

message:
"Organizer profile updated successfully",

organizer

});


}catch(error){

next(error);

}


};







const changeOrganizerPassword = async(
req,
res,
next
)=>{


try{


const {

currentPassword,

newPassword,

confirmPassword

}=req.body;



if(
!currentPassword ||
!newPassword ||
!confirmPassword
){

return next(
errorHandler(
400,
"All fields are required"
)
);

}



if(newPassword !== confirmPassword){

return next(
errorHandler(
400,
"Passwords do not match"
)
);

}



if(newPassword.length < 6){

return next(
errorHandler(
400,
"Password must be at least 6 characters"
)
);

}




const account =
await Auth.findById(
req.user.id
);



if(!account){

return next(
errorHandler(
404,
"Account not found"
)
);

}



const match =
await bcrypt.compare(

currentPassword,

account.password

);



if(!match){

return next(
errorHandler(
401,
"Current password incorrect"
)
);

}



account.password =
await bcrypt.hash(
newPassword,
10
);



await account.save();



await sendOrganizerPasswordChangedNotification(
account.email
);



res.status(200).json({

message:
"Password changed successfully"

});



}catch(error){

next(error);

}

};


// DELETE ORGANIZER ACCOUNT

const deleteOrganizerProfile = async(
req,
res,
next
)=>{


try{


const organizer =

await Organizer.findOneAndDelete({

user:req.user.id

});



if(!organizer){

return next(

errorHandler(

404,

"Organizer profile not found"

)

);

}




const account =
await Auth.findById(
req.user.id
);


await sendOrganizerDeleteNotification(
account.email
);



await Auth.findByIdAndDelete(
req.user.id
);




res.status(200).json({

message:
"Organizer account deleted successfully"

});



}catch(error){

next(error);

}


};

module.exports={

registerOrganizer,

getOrganizerProfile,

getOrganizerDashboard,

getOrganizerBookings,

updateOrganizerProfile,

changeOrganizerPassword,

deleteOrganizerProfile

};