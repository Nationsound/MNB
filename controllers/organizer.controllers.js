const Organizer = require("../models/organizerSchema");
const Auth = require("../models/auth.schema");
const Event = require("../models/eventSchema");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error");





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


module.exports={

registerOrganizer,

getOrganizerProfile,

getOrganizerDashboard

};