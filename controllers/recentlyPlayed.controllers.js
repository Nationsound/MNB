const RecentlyPlayed = require("../models/recentlyPlayed.schema");
const Song = require("../models/songSchema");




// ADD RECENTLY PLAYED

const addRecentlyPlayed = async(req,res)=>{


try{


const {
songId
}=req.body;




if(!songId){

return res.status(400).json({

message:"Song ID required"

});

}





const song = await Song.findById(songId);



if(!song){

return res.status(404).json({

message:"Song not found"

});

}







// remove duplicate previous play

await RecentlyPlayed.deleteOne({

user:req.user.id,

song:songId

});







const recent = await RecentlyPlayed.create({

user:req.user.id,

song:songId

});







res.status(201).json({

message:"Added to recently played",

recent

});





}

catch(error){


console.log(
"RECENT PLAY ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};









// GET USER RECENTLY PLAYED


const getRecentlyPlayed = async(req,res)=>{


try{


const songs = await RecentlyPlayed.find({

user:req.user.id

})

.populate("song")

.sort({

playedAt:-1

})

.limit(20);





res.status(200).json({

songs

});



}

catch(error){


console.log(
"GET RECENT PLAY ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};







module.exports={

addRecentlyPlayed,

getRecentlyPlayed

};