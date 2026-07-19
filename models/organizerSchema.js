const mongoose = require("mongoose");


const organizerSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"Auth",
required:true
},


businessName:{
type:String,
required:true,
trim:true
},


contactName:{
type:String,
required:true,
trim:true
},


email:{
type:String,
required:true,
lowercase:true,
trim:true
},


phone:{
type:String,
required:true,
trim:true
},


description:{
type:String,
default:""
},


logo:{
url:String,
publicId:String
},



verificationStatus:{

type:String,

enum:[
"pending",
"approved",
"rejected"
],

default:"pending"

},



totalEvents:{
type:Number,
default:0
},


totalTicketsSold:{
type:Number,
default:0
},

totalRevenue:{
type:Number,
default:0
}


},{

timestamps:true

});



module.exports =
mongoose.model(
"Organizer",
organizerSchema
);