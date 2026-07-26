const LikedSong = require("../models/likedSong.schema");
const Song = require("../models/songSchema");







// LIKE SONG


const likeSong = async(req,res)=>{


try{


const {
songId
}=req.body;




const song =
await Song.findById(songId);



if(!song){

return res.status(404).json({

message:"Song not found"

});

}






const exists =
await LikedSong.findOne({

user:req.user.id,

song:songId

});




if(exists){

return res.status(400).json({

message:"Song already liked"

});

}





const liked =
await LikedSong.create({

user:req.user.id,

song:songId

});







res.status(201).json({

message:"Song liked",

liked

});



}

catch(error){


console.log(
"LIKE SONG ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};




const checkLikedSong = async(req,res)=>{

try{


const {
songId
}=req.params;



const liked = await LikedSong.findOne({

user:req.user.id,

song:songId

});




res.status(200).json({

liked: !!liked

});



}

catch(error){


console.log(
"CHECK LIKE ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};





// REMOVE LIKE


const unlikeSong = async(req,res)=>{


try{


const {
songId
}=req.body;




await LikedSong.findOneAndDelete({

user:req.user.id,

song:songId

});




res.status(200).json({

message:"Song unliked"

});



}

catch(error){


console.log(
"UNLIKE ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};










// GET LIKED SONGS


const getLikedSongs = async(req,res)=>{


try{


const songs =

await LikedSong.find({

user:req.user.id

})

.populate("song")

.sort({

createdAt:-1

});






res.status(200).json({

songs

});



}

catch(error){


console.log(
"LIKED SONGS ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};









module.exports={


likeSong,

checkLikedSong,

unlikeSong,

getLikedSongs


};