const ArtistFollow = require("../models/artistFollow.schema");
const Artist = require("../models/artistSchema");






// FOLLOW ARTIST


const followArtist = async(req,res)=>{


try{


const {
artistId
}=req.body;




const artist =
await Artist.findById(artistId);




if(!artist){

return res.status(404).json({

message:"Artist not found"

});

}





const exists =
await ArtistFollow.findOne({

user:req.user.id,

artist:artistId

});





if(exists){

return res.status(400).json({

message:"Already following artist"

});

}







const follow = await ArtistFollow.create({

user:req.user.id,

artist:artistId

});







artist.followers += 1;

await artist.save();







res.status(201).json({

message:"Artist followed",

follow

});



}

catch(error){


console.log(
"FOLLOW ARTIST ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};




const checkFollowStatus = async(req,res)=>{


try{


const follow = await ArtistFollow.findOne({

user:req.user.id,

artist:req.params.artistId

});




res.status(200).json({

following:!!follow

});



}

catch(error){


console.log(
"CHECK FOLLOW ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}


};







// UNFOLLOW ARTIST


const unfollowArtist = async(req,res)=>{


try{


const {
artistId
}=req.body;





const removed =
await ArtistFollow.findOneAndDelete({

user:req.user.id,

artist:artistId

});




if(!removed){

return res.status(404).json({

message:"Follow not found"

});

}





await Artist.findByIdAndUpdate(

artistId,

{

$inc:{
followers:-1
}

}

);







res.status(200).json({

message:"Artist unfollowed"

});




}

catch(error){


console.log(
"UNFOLLOW ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};







// GET FOLLOWED ARTISTS


const getFollowedArtists = async(req,res)=>{


try{


const artists =
await ArtistFollow.find({

user:req.user.id

})

.populate("artist")

.sort({

createdAt:-1

});




res.status(200).json({

artists

});



}

catch(error){


console.log(
"FOLLOWED ARTISTS ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}



};








module.exports={

followArtist,

checkFollowStatus,

unfollowArtist,

getFollowedArtists

};