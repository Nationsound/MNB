const Playlist = require("../models/playlist.schema");
const Song = require("../models/songSchema");
const MNBUser = require("../models/mnbUserSchema");






// GET MNB USER PROFILE FROM AUTH USER

const getMNBUser = async(req)=>{


const mnbUser = await MNBUser.findOne({

user:req.user.id

});



return mnbUser;


};









// CREATE PLAYLIST

const createPlaylist = async(req,res)=>{


try{


const {
name,
coverImage
}=req.body;





if(!name){


return res.status(400).json({

message:"Playlist name required"

});

}





const mnbUser = await getMNBUser(req);




if(!mnbUser){


return res.status(404).json({

message:"MNB user profile not found"

});

}





const playlist = await Playlist.create({


name,


coverImage:coverImage || "",


user:mnbUser.id,


songs:[]


});







return res.status(201).json({


message:"Playlist created",


playlist


});





}

catch(error){


console.log(

"CREATE PLAYLIST ERROR:",

error

);



return res.status(500).json({

message:error.message

});


}


};












// GET USER PLAYLISTS

const getUserPlaylists = async(req,res)=>{


try{


const mnbUser = await getMNBUser(req);





if(!mnbUser){


return res.status(404).json({

message:"MNB user profile not found"

});

}




const playlists = await Playlist.find({


user:mnbUser._id


})


.populate("songs")


.sort({

createdAt:-1

});







return res.status(200).json({


playlists


});







}

catch(error){


console.log(

"GET PLAYLIST ERROR:",

error

);



return res.status(500).json({

message:error.message

});


}



};











// ADD SONG TO PLAYLIST

const addSongToPlaylist = async(req,res)=>{


try{


const {

playlistId,

songId

}=req.body;





if(!playlistId || !songId){


return res.status(400).json({

message:"Playlist ID and Song ID required"

});


}






const mnbUser = await getMNBUser(req);





if(!mnbUser){


return res.status(404).json({

message:"MNB user profile not found"

});

}








const playlist = await Playlist.findOne({


_id:playlistId,


user:mnbUser._id


});






if(!playlist){


return res.status(404).json({

message:"Playlist not found"

});


}







const song = await Song.findById(songId);





if(!song){


return res.status(404).json({

message:"Song not found"

});


}








const alreadyExists = playlist.songs.some(

song=>

song.toString() === songId

);






if(alreadyExists){


return res.status(400).json({

message:"Song already exists in playlist"

});


}









playlist.songs.push(songId);



await playlist.save();








return res.status(200).json({


message:"Song added to playlist",


playlist


});






}

catch(error){


console.log(

"ADD SONG ERROR:",

error

);



return res.status(500).json({

message:error.message

});


}



};












// REMOVE SONG FROM PLAYLIST

const removeSongFromPlaylist = async(req,res)=>{


try{


const {

playlistId,

songId

}=req.body;





const mnbUser = await getMNBUser(req);





if(!mnbUser){


return res.status(404).json({

message:"MNB user profile not found"

});


}








const playlist = await Playlist.findOne({


_id:playlistId,


user:mnbUser._id


});







if(!playlist){


return res.status(404).json({

message:"Playlist not found"

});


}









playlist.songs = playlist.songs.filter(

song=>

song.toString() !== songId

);






await playlist.save();






return res.status(200).json({


message:"Song removed from playlist",


playlist


});





}

catch(error){


console.log(

"REMOVE SONG ERROR:",

error

);



return res.status(500).json({

message:error.message

});


}



};












// DELETE PLAYLIST

const deletePlaylist = async(req,res)=>{


try{



const mnbUser = await getMNBUser(req);





if(!mnbUser){


return res.status(404).json({

message:"MNB user profile not found"

});


}







const playlist = await Playlist.findOneAndDelete({


_id:req.params.id,


user:mnbUser._id


});






if(!playlist){


return res.status(404).json({

message:"Playlist not found"

});


}







return res.status(200).json({


message:"Playlist deleted"


});





}

catch(error){


console.log(

"DELETE PLAYLIST ERROR:",

error

);



return res.status(500).json({

message:error.message

});


}



};












module.exports = {


createPlaylist,


getUserPlaylists,


addSongToPlaylist,


removeSongFromPlaylist,


deletePlaylist


};