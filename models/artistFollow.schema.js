const mongoose=require("mongoose");


const artistFollowSchema =
new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"MNBUser",
required:true
},


artist:{
type:mongoose.Schema.Types.ObjectId,
ref:"Artist",
required:true
},


createdAt:{
type:Date,
default:Date.now
}


});


module.exports =
mongoose.model(
"ArtistFollow",
artistFollowSchema
);