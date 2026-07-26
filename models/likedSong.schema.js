const mongoose = require("mongoose");


const likedSongSchema = new mongoose.Schema({


user:{
type:mongoose.Schema.Types.ObjectId,
ref:"MNBUser",
required:true
},


song:{
type:mongoose.Schema.Types.ObjectId,
ref:"Song",
required:true
},


createdAt:{
type:Date,
default:Date.now
}


});


module.exports = mongoose.model(
"LikedSong",
likedSongSchema
);