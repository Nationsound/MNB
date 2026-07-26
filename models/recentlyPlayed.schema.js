const mongoose = require("mongoose");


const recentlyPlayedSchema = new mongoose.Schema({

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


playedAt:{
type:Date,
default:Date.now
}


});


module.exports =
mongoose.model(
"RecentlyPlayed",
recentlyPlayedSchema
); 