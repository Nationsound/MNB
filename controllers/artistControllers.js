const Artist = require("../models/artistSchema");
const Song = require("../models/songSchema");
const Album = require("../models/albumSchema");

const {
  cloudinary,
  uploadBufferToCloudinary
} = require("../utils/cloudinary");


const sharp = require("sharp");





// ==============================
// IMAGE COMPRESSION
// ==============================


const compressImage = async(buffer)=>{


return await sharp(buffer)

.resize({

width:1200,

height:1200,

fit:"inside",

withoutEnlargement:true

})


.webp({

quality:80

})


.toBuffer();


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

featured === "true" || featured === true,




verified:

verified === "true" || verified === true,





socialLinks:{


instagram:instagram || "",

twitter:twitter || "",

youtube:youtube || "",

spotify:spotify || ""

}


};









// IMAGE UPLOAD


if(req.file){



const compressed =
await compressImage(
req.file.buffer
);




const upload =

await uploadBufferToCloudinary(

compressed,

"mnb/artists"

);






artistData.profileImageUrl =
upload.secure_url;



artistData.profileImagePublicId =
upload.public_id;



// backwards compatibility


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


message:
"Artist created successfully",


artist


});






}catch(error){


console.log(
"Create Artist Error:",
error
);



res.status(500).json({

message:
"Failed creating artist",

error:error.message

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

message:
"Failed fetching artists"

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

message:
"Artist not found"

});


}









// ==============================
// FETCH ARTIST SONGS
// SUPPORT OLD + NEW DATA
// ==============================


const songs =

await Song.find({

$or:[

{
artistId:artist._id
},


{
artist:artist.name
}

]

})

.sort({

createdAt:-1

});









// ==============================
// FETCH ALBUMS
// SUPPORT OLD + NEW DATA
// ==============================


const albums =

await Album.find({

$or:[

{
artistId:artist._id
},


{
artist:artist.name
}

]

})

.sort({

createdAt:-1

});









// ==============================
// TOTAL STREAM CALCULATION
// ==============================


const totalStreams =

songs.reduce(

(total,song)=>{

return total + (song.streams || 0);

},

0

);









// ==============================
// TOP SONGS
// ==============================


const topSongs =

[...songs]

.sort(

(a,b)=>

(b.streams || 0)

-

(a.streams || 0)

)

.slice(0,5);









// ==============================
// RELATED ARTISTS
// ==============================


const relatedArtists =

await Artist.find({

genre:{

$in:artist.genre

},


_id:{

$ne:artist._id

}

})

.limit(6)

.select(

"name slug profileImageUrl verified genre"

);









// ==============================
// ANALYTICS
// ==============================


const analytics = {


totalSongs:
songs.length,


totalAlbums:
albums.length,


totalStreams,


topSongs,


weeklyStreams:
artist.weeklyStreams || 0,


weeklyListeners:
artist.weeklyListeners || 0,


listenerHistory:
artist.listenerHistory || []

};









// ==============================
// FINAL RESPONSE
// ==============================


res.json({

artist,


songs,


albums,


relatedArtists,


stats:{


followers:

Array.isArray(
artist.followersList
)

?

artist.followersList.length

:

artist.followers || 0,



monthlyListeners:

artist.monthlyListeners || 0,



streams:

totalStreams,



views:

artist.views || 0


},



analytics



});







}catch(error){


console.log(

"Artist details error:",

error

);



res.status(500).json({

message:
"Failed loading artist"

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

message:
"Artist not found"

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

(

featured==="true"

||

featured===true

)

:

artist.featured,





verified:

verified !== undefined

?

(

verified==="true"

||

verified===true

)

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









// NEW IMAGE


if(req.file){



const compressed =

await compressImage(

req.file.buffer

);





const upload =

await uploadBufferToCloudinary(

compressed,

"mnb/artists"

);






updateData.profileImageUrl =

upload.secure_url;



updateData.profileImagePublicId =

upload.public_id;





// old support


updateData.imageUrl =

upload.secure_url;


updateData.imagePublicId =

upload.public_id;









// DELETE OLD IMAGE


const oldImage =

artist.profileImagePublicId

||

artist.imagePublicId;





if(oldImage){


try{


await cloudinary.uploader.destroy(

oldImage,

{

resource_type:"image"

}

);


}catch(err){


console.log(

"Old image delete failed:",

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

message:
"Artist updated successfully",

artist:updatedArtist

});







}catch(error){


console.log(

"Update Artist Error:",

error

);



res.status(500).json({

message:
"Failed updating artist",

error:error.message

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

message:
"Artist not found"

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



}catch(err){


console.log(

"Cloudinary delete error:",

err.message

);


}


}






await Artist.findByIdAndDelete(

req.params.id

);






res.json({

message:
"Artist deleted successfully"

});





}catch(error){


console.log(error);



res.status(500).json({

message:
"Failed deleting artist"

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