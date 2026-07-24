const Song = require("../models/songSchema");
const Artist = require("../models/artistSchema");
const Album = require("../models/albumSchema");
// const streamifier = require("streamifier");
const NodeID3 = require("node-id3");
const slugify = require("slugify");
const {
  cloudinary,
  uploadBufferToCloudinary
} = require("../utils/cloudinary");




// ========================================
// CREATE SONG
// ========================================


const createSong = async(req,res,next)=>{

console.log("🔥 CREATE SONG CONTROLLER HIT");

try{


const {


title,

artist,

artistId,

album,

albumName,

genre,

description,

releaseDate,

lyrics,

featured


}=req.body;





if(!title || !genre){

return res.status(400).json({

message:
"Title and genre are required"

});

}





const audioFile =
req.files?.audio?.[0];


const imageFile =
req.files?.coverImage?.[0];





if(!audioFile){

return res.status(400).json({

message:
"Audio file is required"

});

}






if(audioFile.mimetype !== "audio/mpeg"){

return res.status(400).json({

message:
"Only MP3 files allowed"

});

}







// =================================
// FIND ARTIST
// =================================


let artistName = artist;




if(artistId){


const artistDoc =
await Artist.findById(artistId);



if(!artistDoc){

return res.status(404).json({

message:
"Artist not found"

});

}



artistName =
artistDoc.name;


}






const slug = slugify(

`${title}-${artistName}`,

{

lower:true,

strict:true

}

);







// =================================
// ID3 TAGS
// =================================


const tags={


title,


artist:artistName,


album:albumName || "",


genre


};






if(imageFile){


tags.APIC={

mime:imageFile.mimetype,

type:{
id:3,
name:"front cover"
},

description:"Cover",

imageBuffer:imageFile.buffer

};


}







let audioBuffer =
NodeID3.update(

tags,

audioFile.buffer

);








// =================================
// UPLOAD AUDIO
// =================================


const audioUpload =
await uploadBufferToCloudinary(

audioBuffer,

{

folder:"mnb/music/songs",

resource_type:"video",

public_id:slug,

overwrite:true

}

);








// =================================
// UPLOAD COVER
// =================================


let coverUpload=null;



if(imageFile){


coverUpload =
await uploadBufferToCloudinary(

imageFile.buffer,

{

folder:"mnb/music/covers",

resource_type:"image",

public_id:slug,

overwrite:true

}

);


}








// =================================
// SAVE SONG
// =================================


const song =

console.log("NEW SONG DATA:", {
 title,
 artistName,
 genre,
 lyrics,
 featured,
 typeofFeatured: typeof featured
});
await Song.create({

title,


slug,


artist:artistName,


artistId:
artistId || null,


album:
album || null,


albumName,


genre,


description,



audioUrl:
audioUpload.secure_url,


audioPublicId:
audioUpload.public_id,



coverImageUrl:
coverUpload?.secure_url,


coverImagePublicId:
coverUpload?.public_id,

lyrics,

featured:
featured === "true" || featured === true,

releaseDate:
releaseDate || Date.now()


});








res.status(201).json({

message:
"Song uploaded successfully",

song

});





}catch(error){

console.log(
"Create song error:",
error
);

next(error);

}



};









// ========================================
// GET ALL SONGS
// ========================================


const getAllSongs = async(req,res,next)=>{


try{


const songs =
await Song.find()

.populate(
"artistId",
"name slug profileImageUrl"
)

.populate(
"album"
)

.sort({
createdAt:-1
});



res.json({

songs

});




}catch(error){

next(error);

}


};









// ========================================
// GET SONG BY SLUG
// ========================================


const getSongBySlug =
async(req,res)=>{


try{


const song =
await Song.findOne({

slug:req.params.slug

})

.populate(
"artistId"
)

.populate(
"album"
);





if(!song){

return res.status(404).json({

message:
"Song not found"

});

}





res.json(song);





}catch(error){


res.status(500).json({

message:
"Server error"

});


}


};









// ========================================
// UPDATE SONG
// ========================================


const updateSong =
async(req,res)=>{


try{


const song =
await Song.findOne({

slug:req.params.slug

});





if(!song){

return res.status(404).json({

message:
"Song not found"

});

}






const {


title,

artist,

artistId,

album,

albumName,

genre,

description,

lyrics,

featured,

releaseDate


}=req.body;







const update={



title:
title ?? song.title,



artist:
artist ?? song.artist,



artistId:
artistId ?? song.artistId,



album:
album ?? song.album,



albumName:
albumName ?? song.albumName,



genre:
genre ?? song.genre,


description:
description ?? song.description,

lyrics,

featured:
featured === "true" || featured === true,

releaseDate:
releaseDate ?? song.releaseDate


};









const audioFile =
req.files?.audio?.[0];


const imageFile =
req.files?.coverImage?.[0];







if(audioFile){



const tags={


title:update.title,


artist:update.artist,


album:update.albumName || "",


genre:update.genre


};





const audioBuffer =
NodeID3.update(

tags,

audioFile.buffer

);





const upload =
await uploadBufferToCloudinary(

audioBuffer,

{

folder:"mnb/music/songs",

public_id:song.slug,

overwrite:true,

resource_type:"video"

}

);




update.audioUrl =
upload.secure_url;



update.audioPublicId =
upload.public_id;




}








if(imageFile){


const upload =
await uploadBufferToCloudinary(

imageFile.buffer,

{

folder:"mnb/music/covers",

public_id:song.slug,

overwrite:true,

resource_type:"image"

}

);




update.coverImageUrl =
upload.secure_url;



update.coverImagePublicId =
upload.public_id;



}








const updatedSong =
await Song.findByIdAndUpdate(

song._id,

update,

{
new:true
}

);







res.json({

message:
"Song updated",

song:updatedSong

});





}catch(error){


console.log(error);


res.status(500).json({

message:
"Update failed"

});


}



};









// ========================================
// DELETE SONG
// ========================================


const deleteSong =
async(req,res)=>{


try{


const song =
await Song.findOne({

slug:req.params.slug

});




if(!song){

return res.status(404).json({

message:
"Song not found"

});

}






if(song.audioPublicId){

await cloudinary.uploader.destroy(

song.audioPublicId,

{

resource_type:"video"

}

);

}





if(song.coverImagePublicId){

await cloudinary.uploader.destroy(

song.coverImagePublicId,

{

resource_type:"image"

}

);

}






await Song.findByIdAndDelete(
song._id
);





res.json({

message:
"Song deleted"

});






}catch(error){


res.status(500).json({

message:
"Delete failed"

});


}


};









// ========================================
// STREAM SONG
// ========================================


const streamSong =
async(req,res)=>{


try{


const song =
await Song.findById(req.params.id);



if(!song){

return res.status(404).json({

message:
"Song not found"

});

}



song.streams += 1;


song.lastPlayedAt =
new Date();


await song.save();



res.redirect(
song.audioUrl
);



}catch(error){

res.status(500).json({

message:
"Streaming error"

});

}


};









// ========================================
// DOWNLOAD SONG
// ========================================


const downloadSong =
async(req,res)=>{


try{


const song =
await Song.findById(req.params.id);



if(!song){

return res.status(404).json({

message:
"Song not found"

});

}



song.downloads +=1;



await song.save();




res.redirect(
song.audioUrl
);



}catch(error){


res.status(500).json({

message:
"Download error"

});


}


};




// ========================================
// TRENDING SONGS
// ========================================

const getTrendingSongs = async(req,res,next)=>{

try{


const songs = await Song.find()

.sort({

views:-1

})

.limit(20);



res.json({

success:true,

songs

});



}catch(error){

console.log(
"TRENDING SONG ERROR:",
error
);

next(error);

}


};


// ========================================
// LATEST SONGS
// ========================================

const getLatestSongs = async(req,res,next)=>{

try{


const songs =
await Song.find()

.populate(
"artistId",
"name slug profileImageUrl"
)

.populate(
"album"
)

.sort({
createdAt:-1
})

.limit(20);



res.json({

success:true,

songs

});


}catch(error){

next(error);

}


};


// ========================================
// FEATURED RELEASE
// ========================================

const getFeaturedSong = async(req,res,next)=>{

try{


const song =
await Song.findOne({
featured:true
})
.populate(
"artistId",
"name slug profileImageUrl"
)
.populate(
"album"
);



console.log("FEATURED SONG:", song);



res.json({

success:true,

song

});


}catch(error){

next(error);

}


};



// ========================================
// GET SONGS BY GENRE
// ========================================

const getSongsByGenre = async(req,res,next)=>{

try{


const genre =
decodeURIComponent(
req.params.genre
);



const songs =
await Song.find({

genre:{
$in:[
genre
]
}

})

.sort({

createdAt:-1

});





res.json({

success:true,

genre,

songs

});



}catch(error){

console.log(
"GENRE ERROR:",
error
);


next(error);


}


};

module.exports={


createSong,

getAllSongs,

getSongBySlug,

updateSong,

deleteSong,

streamSong,

downloadSong,

getTrendingSongs,

getLatestSongs,

getFeaturedSong,

getSongsByGenre


};