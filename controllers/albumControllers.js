const Album = require("../models/albumSchema");
const Song = require("../models/songSchema");

const {
  cloudinary,
  uploadBufferToCloudinary
} = require("../utils/cloudinary");

const slugify = require("slugify");
const NodeID3 = require("node-id3");




// ========================================
// CREATE ALBUM WITH MULTIPLE SONGS
// ========================================

const createAlbum = async(req,res,next)=>{

try{


const {

title,
artist,
artistId,
description,
genre,
releaseDate,
featured

}=req.body;



if(!title || !artist){

return res.status(400).json({

message:
"Album title and artist are required"

});

}





const albumSlug =
slugify(

`${title}-${artist}`,

{
lower:true,
strict:true
}

);





// ================================
// UPLOAD COVER IMAGE
// ================================


let coverUpload = null;



if(
req.files &&
req.files.coverImage
){

const cover =
req.files.coverImage[0];



coverUpload =
await uploadBufferToCloudinary(

cover.buffer,

{

folder:"mnb/music/albums",

resource_type:"image",

public_id:albumSlug,

overwrite:true

}

);

}






// ================================
// CREATE ALBUM FIRST
// ================================


const album =
await Album.create({

title,

slug:albumSlug,

artist,

artistId:
artistId || null,


description,


genre:

genre

?
Array.isArray(genre)

?
genre

:
[genre]

:

[],



coverImageUrl:
coverUpload?.secure_url || "",


coverImagePublicId:
coverUpload?.public_id || "",



releaseDate:
releaseDate || Date.now(),



featured:
featured === "true",


songs:[],


totalSongs:0


});








// ================================
// UPLOAD SONGS
// ================================


let uploadedSongs=[];



if(
req.files &&
req.files.songs
){


for(
const file of req.files.songs
){



// Read MP3 metadata

const tags =
NodeID3.read(
file.buffer
);




const songSlug =
slugify(

`${tags.title || title}-${artist}`,

{
lower:true,
strict:true
}

);







const audioUpload =
await uploadBufferToCloudinary(

file.buffer,

{

folder:"mnb/music/songs",

resource_type:"video",

public_id:songSlug,

overwrite:true

}

);








const song =
await Song.create({

title:
tags.title || title,


artist,


artistId:
artistId || null,



album:

album._id,


albumName:

album.title,



genre:


genre

?
Array.isArray(genre)

?
genre[0]

:
genre

:

"Afro-For-All",




description,


coverImageUrl:
coverUpload?.secure_url || "",



audioUrl:
audioUpload.secure_url,


audioPublicId:
audioUpload.public_id,



releaseDate:
releaseDate || Date.now()



});






uploadedSongs.push(
song._id
);



}



}







// ================================
// CONNECT SONGS TO ALBUM
// ================================


album.songs =
uploadedSongs;


album.totalSongs =
uploadedSongs.length;



await album.save();







// Return populated album

const finalAlbum =
await Album.findById(
album._id
)

.populate(
"songs"
);





res.status(201).json({

message:
"Album created successfully",

album:
finalAlbum

});





}catch(error){


console.log(
"CREATE ALBUM ERROR:",
error
);


next(error);


}


};









// ========================================
// GET ALL ALBUMS
// ========================================


const getAllAlbums = async(
req,
res,
next
)=>{


try{


const albums =
await Album.find()

.populate({

path:"songs",

populate:{

path:"artistId",

select:"name slug"

}

})


.sort({

createdAt:-1

});





res.status(200).json({

albums

});





}catch(error){

next(error);

}


};









// ========================================
// GET ALBUM BY SLUG
// ========================================


const getAlbumBySlug = async(
req,
res,
next
)=>{


try{


const album =
await Album.findOne({

slug:req.params.slug

})


.populate({

path:"songs",

populate:{

path:"artistId",

select:"name slug"

}

});






if(!album){

return res.status(404).json({

message:
"Album not found"

});

}





res.status(200).json({

album,

songs:
album.songs || []

});






}catch(error){

next(error);

}


};









// ========================================
// UPDATE ALBUM
// ========================================


const updateAlbum = async(
req,
res,
next
)=>{


try{


const album =
await Album.findById(
req.params.id
);




if(!album){

return res.status(404).json({

message:
"Album not found"

});

}




const {

title,
artist,
description,
genre,
releaseDate,
featured

}=req.body;






album.title =
title || album.title;


album.artist =
artist || album.artist;


album.description =
description || album.description;



album.genre =

genre

?

Array.isArray(genre)

?
genre

:
[genre]

:

album.genre;




album.releaseDate =
releaseDate || album.releaseDate;




album.featured =

featured !== undefined

?

featured==="true"

:

album.featured;







// update cover image

if(

req.files &&
req.files.coverImage

){


const image =
req.files.coverImage[0];



const upload =
await uploadBufferToCloudinary(

image.buffer,

{

folder:"mnb/music/albums",

resource_type:"image",

public_id:album.slug,

overwrite:true

}

);



album.coverImageUrl =
upload.secure_url;



album.coverImagePublicId =
upload.public_id;


}





await album.save();





res.json({

message:
"Album updated successfully",

album

});




}catch(error){

next(error);

}


};









// ========================================
// DELETE ALBUM
// ========================================


const deleteAlbum = async(
req,
res,
next
)=>{


try{


const album =
await Album.findById(
req.params.id
);




if(!album){

return res.status(404).json({

message:
"Album not found"

});

}





// remove album reference from songs

await Song.updateMany(

{

album:
album._id

},

{

$unset:{

album:""

},

$set:{

albumName:""

}

}

);








// delete album cover

if(

album.coverImagePublicId

){


await cloudinary.uploader.destroy(

album.coverImagePublicId,

{

resource_type:"image"

}

);


}







// delete songs audio files

const songs =
await Song.find({

_id:{
$in:album.songs
}

});




for(
const song of songs
){


if(song.audioPublicId){


await cloudinary.uploader.destroy(

song.audioPublicId,

{

resource_type:"video"

}

);


}


await Song.findByIdAndDelete(
song._id
);


}







await Album.findByIdAndDelete(
album._id
);






res.json({

message:
"Album deleted successfully"

});





}catch(error){

next(error);

}


};







module.exports={

createAlbum,

getAllAlbums,

getAlbumBySlug,

updateAlbum,

deleteAlbum

};