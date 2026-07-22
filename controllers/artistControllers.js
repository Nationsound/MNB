const Artist = require("../models/artistSchema");
const Song = require("../models/songSchema");
const Album = require("../models/albumSchema");

const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");





// ==============================
// CLOUDINARY UPLOAD HELPER
// ==============================

const uploadBufferToCloudinary = (
  buffer,
  folder = "mnb/artists"
)=>{

return new Promise((resolve,reject)=>{


const stream =
cloudinary.uploader.upload_stream(

{
folder,
resource_type:"image"
},

(error,result)=>{

if(error){

reject(error);

}else{

resolve(result);

}

}

);


streamifier
.createReadStream(buffer)
.pipe(stream);


});


};








// ==============================
// CREATE ARTIST
// ==============================


const createArtist = async(req,res)=>{


try{


const {

name,
bio,
country,
genre,
featured,
verified,
instagram,
twitter,
youtube,
spotify


}=req.body;





const artistData={


name,

bio,

country:


country || "Nigeria",



genre:

genre
?
JSON.parse(genre)
:
[],



featured:

featured === "true",



verified:

verified === "true",





socialLinks:{


instagram: instagram || "",

twitter: twitter || "",

youtube: youtube || "",

spotify: spotify || ""

}



};







// IMAGE UPLOAD


if(req.file){


const upload =
await uploadBufferToCloudinary(
req.file.buffer
);



artistData.profileImageUrl =
upload.secure_url;


artistData.profileImagePublicId =
upload.public_id;



// OLD SUPPORT

artistData.imageUrl =
upload.secure_url;


artistData.imagePublicId =
upload.public_id;



}








const artist =
await Artist.create(
artistData
);






res.status(201).json({

message:"Artist created successfully",

artist

});







}catch(error){


console.log(
"Create Artist Error:",
error
);



res.status(500).json({

message:"Failed creating artist"

});


}



};












// ==============================
// GET ALL ARTISTS
// ==============================


const getAllArtists = async(req,res)=>{


try{


const artists =
await Artist.find()
.sort({
createdAt:-1
});



res.json({

artists

});



}catch(error){


console.log(error);


res.status(500).json({

message:"Failed fetching artists"

});


}



};









// ==============================
// GET SINGLE ARTIST
// ==============================


const getArtistBySlug = async(req,res)=>{


try{


const artist =
await Artist.findOne({

slug:req.params.slug

});





if(!artist){


return res.status(404).json({

message:"Artist not found"

});


}





// FIND ARTIST SONGS

const songs =
await Song.find({

artist:
artist._id

})
.sort({

createdAt:-1

});







// FIND ARTIST ALBUMS

const albums =
await Album.find({

artist:
artist._id

})
.sort({

createdAt:-1

});







res.json({

artist,

songs,

albums

});







}catch(error){


console.log(
"Artist details error:",
error
);



res.status(500).json({

message:"Failed loading artist"

});


}



};









// ==============================
// UPDATE ARTIST
// ==============================


const updateArtist = async(req,res)=>{


try{


const artist =
await Artist.findById(
req.params.id
);





if(!artist){


return res.status(404).json({

message:"Artist not found"

});


}







const {

name,
bio,
country,
genre,
featured,
verified,
instagram,
twitter,
youtube,
spotify


}=req.body;







const updateData={



name:
name ?? artist.name,



bio:
bio ?? artist.bio,



country:
country ?? artist.country,




genre:

genre

?

JSON.parse(genre)

:

artist.genre,







featured:

featured !== undefined

?

featured === "true"

:

artist.featured,







verified:

verified !== undefined

?

verified === "true"

:

artist.verified,








socialLinks:{


instagram:
instagram ?? artist.socialLinks?.instagram,


twitter:
twitter ?? artist.socialLinks?.twitter,


youtube:
youtube ?? artist.socialLinks?.youtube,


spotify:
spotify ?? artist.socialLinks?.spotify



}



};








// UPDATE IMAGE


if(req.file){



const upload =
await uploadBufferToCloudinary(
req.file.buffer
);




updateData.profileImageUrl =
upload.secure_url;



updateData.profileImagePublicId =
upload.public_id;





// backwards compatibility

updateData.imageUrl =
upload.secure_url;


updateData.imagePublicId =
upload.public_id;








// DELETE OLD IMAGE


if(
artist.profileImagePublicId
){


try{


await cloudinary.uploader.destroy(

artist.profileImagePublicId,

{
resource_type:"image"
}

);


}catch(err){


console.log(
"Cloudinary delete error:",
err.message
);


}



}



}









const updatedArtist =

await Artist.findByIdAndUpdate(

req.params.id,

updateData,

{
new:true
}

);







res.json({

message:"Artist updated successfully",

artist:updatedArtist

});









}catch(error){


console.log(
"Update Artist Error:",
error
);



res.status(500).json({

message:"Failed updating artist"

});


}



};












// ==============================
// DELETE ARTIST
// ==============================


const deleteArtist = async(req,res)=>{


try{


const artist =
await Artist.findById(
req.params.id
);




if(!artist){


return res.status(404).json({

message:"Artist not found"

});


}








const imageId =

artist.profileImagePublicId

||

artist.imagePublicId;







if(imageId){


try{


await cloudinary.uploader.destroy(

imageId,

{
resource_type:"image"
}

);


}catch(error){


console.log(
"Cloudinary delete error:",
error.message
);


}


}








await Artist.findByIdAndDelete(
req.params.id
);





res.json({

message:"Artist deleted successfully"

});







}catch(error){


console.log(error);



res.status(500).json({

message:"Failed deleting artist"

});


}



};









module.exports={


createArtist,

getAllArtists,

getArtistBySlug,

updateArtist,

deleteArtist


};