const mongoose = require("mongoose");


const streamSchema = new mongoose.Schema({


user:{

type:mongoose.Schema.Types.ObjectId,

ref:"MNBUser",

required:false

},



song:{

type:mongoose.Schema.Types.ObjectId,

ref:"Song",

required:true

},



artist:{

type:mongoose.Schema.Types.ObjectId,

ref:"Artist",

required:false

},



durationPlayed:{

type:Number,

default:0

},



createdAt:{

type:Date,

default:Date.now

}



});





// Faster analytics queries
streamSchema.index({
song:1,
createdAt:-1
});


streamSchema.index({
artist:1,
createdAt:-1
});



module.exports =
mongoose.model(
"Stream",
streamSchema
);