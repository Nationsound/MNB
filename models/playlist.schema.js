const mongoose = require("mongoose");



const playlistSchema = new mongoose.Schema({



name:{


type:String,

required:true,

trim:true

},






user:{


type:mongoose.Schema.Types.ObjectId,

ref:"MNBUser",

required:true

},







songs:[


{


type:mongoose.Schema.Types.ObjectId,

ref:"Song"


}


],








coverImage:{


type:String,

default:""


},



description:{
type:String,
default:""
},

isPublic:{
type:Boolean,
default:false
},

totalStreams:{
type:Number,
default:0
},




createdAt:{


type:Date,

default:Date.now


}




});





module.exports =
mongoose.model(
"Playlist",
playlistSchema
);