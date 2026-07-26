const mongoose = require("mongoose");



const mnbUserSchema = new mongoose.Schema({



user:{

type:mongoose.Schema.Types.ObjectId,

ref:"Auth",

required:true,

unique:true

},





username:{

type:String,

required:true,

unique:true,

lowercase:true,

trim:true

},






/*
USER FOLLOWS
*/

followingArtists:[

{

type:mongoose.Schema.Types.ObjectId,

ref:"Artist"

}

],






/*
USER PLAYLISTS
*/

playlists:[

{

type:mongoose.Schema.Types.ObjectId,

ref:"Playlist"

}

],







/*
LIKED SONGS
*/

likedSongs:[

{

type:mongoose.Schema.Types.ObjectId,

ref:"Song"

}

],







/*
RECENTLY PLAYED
*/

recentlyPlayed:[

{

song:{

type:mongoose.Schema.Types.ObjectId,

ref:"Song"

},


playedAt:{

type:Date,

default:Date.now

}

}

],







/*
LISTENING HISTORY
*/

listeningHistory:[

{

song:{

type:mongoose.Schema.Types.ObjectId,

ref:"Song"

},


artist:{

type:mongoose.Schema.Types.ObjectId,

ref:"Artist"

},


playedAt:{

type:Date,

default:Date.now

}

}

],








createdAt:{

type:Date,

default:Date.now

}


});




module.exports = mongoose.model(
"MNBUser",
mnbUserSchema
);