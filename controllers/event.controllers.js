const Event = require("../models/eventSchema");
const Organizer = require("../models/organizerSchema");
const errorHandler = require("../utils/error");

const {

sendEventApprovedNotification,

sendEventRejectedNotification

}=require("../utils/organizerNotifications");

const {
  cloudinary,
  uploadBufferToCloudinary
} = require("../utils/cloudinary");

const sharp = require("sharp");




// CREATE EVENT

const addEvent = async(req,res,next)=>{


// console.log("USER:", req.user);
// console.log("BODY:", req.body);
// console.log("FILES RECEIVED:", req.files);



if(
!req.user ||
(
!req.user.isAdmin &&
req.user.accountType !== "organizer"
)
){

return next(
errorHandler(
403,
"You are not allowed to create events"
)
);

}



try{


const {

title,
description,
date,
time,
venue,
category,
organizerType,
organizer,
ticketTypes

}=req.body;




if(
!title ||
!description ||
!date ||
!time ||
!venue ||
!category
){

return next(
errorHandler(
400,
"Missing required event fields"
)
);

}




const slug =
title
.toLowerCase()
.trim()
.replace(/[^a-zA-Z0-9 ]/g,"")
.split(" ")
.join("-");




let imageUrl="";
let imagePublicId="";





// COVER IMAGE

if(req.files?.image){


const compressedImage =
await sharp(
req.files.image[0].buffer
)
.resize({

width:1600,

withoutEnlargement:true

})
.jpeg({

quality:80

})
.toBuffer();





const uploaded =
await uploadBufferToCloudinary(
compressedImage
);



imageUrl =
uploaded.secure_url;



imagePublicId =
uploaded.public_id;



}






// GALLERY IMAGES


let galleryImages=[];



if(req.files?.galleryImages){



for(
const file of req.files.galleryImages
){


const compressedImage =
await sharp(file.buffer)
.resize({

width:1200,

withoutEnlargement:true

})
.jpeg({

quality:75

})
.toBuffer();




const uploaded =
await uploadBufferToCloudinary(
compressedImage
);



galleryImages.push({

url:uploaded.secure_url,

publicId:uploaded.public_id

});


}


}



let organizerProfile = null;


if(req.user.accountType === "organizer"){


organizerProfile =
await Organizer.findOne({

user:req.user.id

});


if(!organizerProfile){

return next(
errorHandler(
404,
"Organizer profile not found"
)
);

}

}




const organizerData =

req.user.accountType === "organizer"

?

{

name:organizerProfile.contactName,

email:organizerProfile.email,

phone:organizerProfile.phone,

company:organizerProfile.businessName

}

:

(

organizer

?

JSON.parse(organizer)

:

{}

);




const event = await Event.create({

title,

slug,

description,

date,

time,

venue,

category,

organizerType,

organizer:organizerData,

approvalStatus:
req.user.accountType === "organizer"
?
"pending"
:
req.body.approvalStatus || "pending",

ticketTypes:

ticketTypes
?
JSON.parse(ticketTypes)
:
[],


imageUrl,

imagePublicId,

galleryImages,


createdBy:req.user.id,


organizerProfile:

organizerProfile
?
organizerProfile._id
:
null


});




res.status(201).json(event);




}catch(error){


console.error(
"CREATE EVENT ERROR:",
error
);


next(error);


}



};









// GET ALL EVENTS


const getAllEvents = async(req,res,next)=>{


try{


const events =
await Event.find()
.sort({

createdAt:-1

});



res.status(200).json(events);



}catch(error){

next(error);

}


};









// GET EVENT BY SLUG


const getEvent = async(req,res,next)=>{


try{


const event =
await Event.findOne({

slug:req.params.slug

});



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



res.status(200).json(event);



}catch(error){

next(error);

}


};









// GET EVENT BY ID


const getEventById = async(req,res,next)=>{


try{


const event =
await Event.findById(
req.params.id
);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



res.status(200).json(event);



}catch(error){

next(error);

}


};











// UPDATE EVENT


const updateEvent = async(req,res,next)=>{


try{


const event =
await Event.findById(
req.params.id
);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}




const updatedData={
...req.body
};





if(req.body.organizer){


updatedData.organizer =
JSON.parse(
req.body.organizer
);


}



if(req.body.ticketTypes){


updatedData.ticketTypes =
JSON.parse(
req.body.ticketTypes
);


}








// UPDATE COVER IMAGE


if(req.files?.image){



const compressedImage =
await sharp(
req.files.image[0].buffer
)
.resize({

width:1600,

withoutEnlargement:true

})
.jpeg({

quality:80

})
.toBuffer();





const uploaded =
await uploadBufferToCloudinary(
compressedImage
);



updatedData.imageUrl =
uploaded.secure_url;


updatedData.imagePublicId =
uploaded.public_id;




if(event.imagePublicId){


await cloudinary.uploader.destroy(
event.imagePublicId
);


}


}








// UPDATE GALLERY


if(req.files?.galleryImages){


let gallery =
[
...(event.galleryImages || [])
];



for(
const file of req.files.galleryImages
){


const compressedImage =
await sharp(file.buffer)
.resize({

width:1200,

withoutEnlargement:true

})
.jpeg({

quality:75

})
.toBuffer();




const uploaded =
await uploadBufferToCloudinary(
compressedImage
);




gallery.push({

url:uploaded.secure_url,

publicId:uploaded.public_id

});


}



updatedData.galleryImages =
gallery;


}








const updatedEvent =
await Event.findByIdAndUpdate(

req.params.id,

{

$set:updatedData

},

{

new:true,

runValidators:true

}

);




res.status(200).json(updatedEvent);



}catch(error){

next(error);

}


};








// DELETE EVENT

const deleteEvent = async(req,res,next)=>{


if(
!req.user ||
(
!req.user.isAdmin &&
req.user.accountType !== "organizer"
)
){

return next(
errorHandler(
403,
"You are not allowed to delete events"
)
);

}



try{


const event =
await Event.findById(
req.params.id
);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}




// ORGANIZER CAN ONLY DELETE OWN EVENTS

if(req.user.accountType === "organizer"){


const organizer =
await Organizer.findOne({

user:req.user.id

});



if(
!organizer ||
!event.organizerProfile ||
event.organizerProfile.toString()
!==
organizer._id.toString()

){

return next(
errorHandler(
403,
"You can only delete your own events"
)
);

}


}







// DELETE COVER IMAGE FROM CLOUDINARY

if(event.imagePublicId){


await cloudinary.uploader.destroy(
event.imagePublicId
);


}







// DELETE GALLERY IMAGES FROM CLOUDINARY

for(
const image of event.galleryImages || []
){


if(image.publicId){


await cloudinary.uploader.destroy(
image.publicId
);


}


}







// DELETE EVENT FROM DATABASE

await Event.findByIdAndDelete(
req.params.id
);







res.status(200).json({

success:true,

message:
"Event deleted successfully"

});






}catch(error){


console.error(
"DELETE EVENT ERROR:",
error
);


next(error);


}


};


// RESTORE EVENT


const restoreEvent = async(req,res,next)=>{

try{

const event =
await Event.findById(
req.params.id
);


if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}


event.status="published";

event.archivedAt=null;


await event.save();


res.status(200).json({

message:
"Event restored successfully",

event

});


}catch(error){

next(error);

}

};






// APPROVAL STATUS


const updateEventApproval = async(req,res,next)=>{

try{


const {status}=req.body;


if(
![
"pending",
"approved",
"rejected"
].includes(status)
){

return next(
errorHandler(
400,
"Invalid approval status"
)
);

}



const event =
await Event.findById(
req.params.id
)
.populate(
"organizerProfile"
);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}




event.approvalStatus = status;


await event.save();





// SEND ORGANIZER NOTIFICATION

if(event.organizerProfile){


if(status === "approved"){

await sendEventApprovedNotification(

event.organizerProfile.email,

event.title

);

}



if(status === "rejected"){


await sendEventRejectedNotification(

event.organizerProfile.email,

event.title

);


}


}




res.status(200).json({

message:
"Event approval updated",

event

});



}catch(error){

next(error);

}

};




// DUPLICATE EVENT

const duplicateEvent = async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);


if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



const newEvent =
await Event.create({

...event.toObject(),

_id:undefined,

title:
`${event.title} Copy`,

slug:
`${event.slug}-copy-${Date.now()}`,

approvalStatus:"pending",

status:"draft",

createdAt:undefined,

updatedAt:undefined

});



res.status(201).json({

message:
"Event duplicated successfully",

event:newEvent

});



}catch(error){

next(error);

}

};







// PUBLISH / UNPUBLISH EVENT

const toggleEventStatus = async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);


if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



event.status =
event.status === "published"

?

"draft"

:

"published";



await event.save();



res.status(200).json({

message:
`Event ${event.status}`,

event

});



}catch(error){

next(error);

}

};







// ARCHIVE EVENT

const archiveEvent = async(req,res,next)=>{

try{


const event =
await Event.findById(
req.params.id
);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



event.status="archived";

event.archivedAt =
new Date();



await event.save();



res.status(200).json({

message:
"Event archived successfully",

event

});



}catch(error){

next(error);

}

};



module.exports={

addEvent,

getAllEvents,

getEvent,

getEventById,

updateEvent,

deleteEvent,

restoreEvent,

updateEventApproval,

duplicateEvent,

toggleEventStatus,

archiveEvent

};