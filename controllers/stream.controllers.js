const Stream = require("../models/stream.schema");
const Song = require("../models/songSchema");
const Artist = require("../models/artistSchema");
const MNBUser = require("../models/mnbUserSchema");





const recordStream = async(req,res)=>{


try{


const {
songId,
durationPlayed
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







const artist = await Artist.findOne({

name:song.artist

});








let user = null;



if(req.user?._id){


const mnbUser = await MNBUser.findOne({

user:req.user._id

});


user = mnbUser?._id || null;


}









const stream = await Stream.create({


user,


song:song._id,


artist:artist?._id || null,


durationPlayed:
durationPlayed || 0


});









song.streams =
(song.streams || 0) + 1;


await song.save();










if(artist){


artist.streams =
(artist.streams || 0) + 1;


artist.weeklyStreams =
(artist.weeklyStreams || 0) + 1;


await artist.save();


}








return res.status(201).json({

message:"Stream recorded",

stream

});






}


catch(error){


console.log(

"STREAM ERROR:",
error

);



return res.status(500).json({

message:error.message

});


}



};







module.exports = {

recordStream

};