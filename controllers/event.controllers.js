const Event = require("../models/eventSchema");
const errorHandler = require("../utils/error");
const {
  cloudinary,
  uploadBufferToCloudinary
} = require("../utils/cloudinary");




// Create Event

const addEvent = async(req,res,next)=>{

    if (!req.user || !req.user.isAdmin) {
  return next(
    errorHandler(403,"You are not allowed to create events")
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


const slug = title
.toLowerCase()
.trim()
.replace(/[^a-zA-Z0-9 ]/g,"")
.split(" ")
.join("-");

let imageUrl="";
let imagePublicId="";



// Upload cover image

if(req.files?.image){


const uploaded =
await uploadBufferToCloudinary(
req.files.image[0].buffer
);


imageUrl =
uploaded.secure_url;


imagePublicId =
uploaded.public_id;


}




// Upload gallery

let galleryImages=[];


if(req.files?.galleryImages){


for(const file of req.files.galleryImages){


const uploaded =
await uploadBufferToCloudinary(
file.buffer
);


galleryImages.push({

url:uploaded.secure_url,

publicId:uploaded.public_id

});


}


}





const event =
await Event.create({


title,

slug,

description,

date,

time,

venue,

category,


organizerType,


organizer:
JSON.parse(organizer),



ticketTypes:
JSON.parse(ticketTypes),



imageUrl,

imagePublicId,


galleryImages



});





res.status(201).json(event);



}catch(error){

next(error);

}


};









// Get All Events

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


// Get Event by Slug

const getEvent = async(req,res,next)=>{

try{

const event = await Event.findOne({
  slug:req.params.slug
});


if(!event){

return next(
 errorHandler(404,"Event not found")
);

}


res.status(200).json(event);


}catch(error){

next(error);

}

};




// Get Single Event

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





// Update Event

const updateEvent = async(req,res,next)=>{

  console.log("EVENT UPDATE USER:", req.user);


  try{


    const event =
    await Event.findById(req.params.id);



    if(!event){

      return next(
        errorHandler(
          404,
          "Event not found"
        )
      );

    }



    const updatedData = {
      ...req.body
    };





    // Convert organizer string to object

    if(req.body.organizer){

      updatedData.organizer =
      JSON.parse(req.body.organizer);

    }




    // Convert ticketTypes string to array

    if(req.body.ticketTypes){

      updatedData.ticketTypes =
      JSON.parse(req.body.ticketTypes);

    }




    // Replace cover image

    if(req.files?.image){


      const uploaded =
      await uploadBufferToCloudinary(
        req.files.image[0].buffer
      );



      updatedData.imageUrl =
      uploaded.secure_url;


      updatedData.imagePublicId =
      uploaded.public_id;




      // Delete old image

      if(event.imagePublicId){


        await cloudinary.uploader.destroy(
          event.imagePublicId
        );


      }


    }







    // Add gallery images

    if(req.files?.galleryImages){


      let gallery =
      [
        ...(event.galleryImages || [])
      ];




      for(const file of req.files.galleryImages){


        const uploaded =
        await uploadBufferToCloudinary(
          file.buffer
        );



        gallery.push({

          url: uploaded.secure_url,

          publicId: uploaded.public_id

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









// Delete Event

const deleteEvent = async(req,res,next)=>{

    if (!req.user || !req.user.isAdmin) {
  return next(
    errorHandler(403,"You are not allowed to delete events") 
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




// Delete cover image

if(event.imagePublicId){


await cloudinary.uploader.destroy(

event.imagePublicId

);


}





// Delete gallery images

for(const image of event.galleryImages){


if(image.publicId){


await cloudinary.uploader.destroy(

image.publicId

);


}


}






await Event.findByIdAndDelete(
req.params.id
);





res.status(200).json({

message:
"Event deleted successfully"

});





}catch(error){

next(error);

}


};


// Update Event Approval Status

const updateEventApproval = async(req,res,next)=>{

try{


const {status}=req.body;


if(
!["pending","approved","rejected"]
.includes(status)
){

return next(
errorHandler(
400,
"Invalid approval status"
)
);

}



const event =
await Event.findByIdAndUpdate(

req.params.id,

{
approvalStatus:status
},

{
new:true
}

);



if(!event){

return next(
errorHandler(
404,
"Event not found"
)
);

}



res.status(200).json({

message:"Event approval updated",

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

updateEventApproval,

};