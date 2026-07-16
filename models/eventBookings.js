const mongoose = require("mongoose");


const eventBookingSchema = new mongoose.Schema(

{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},


event:{
type:mongoose.Schema.Types.ObjectId,
ref:"Event",
required:true
},



tickets:[

{

ticketType:{
type:String,
required:true
},


quantity:{
type:Number,
required:true
},


price:{
type:Number,
required:true
}

}

],



totalAmount:{
type:Number,
required:true
},



paymentMethod:{
type:String,
enum:[
"bank_transfer"
],
default:"bank_transfer"
},



paymentStatus:{

type:String,

enum:[

"pending",
"paid",
"rejected"

],

default:"pending"

},



bookingStatus:{

type:String,

enum:[

"pending",
"confirmed",
"cancelled"

],

default:"pending"

},



paymentProof:{

type:String,
default:""

},



paymentReference:{

type:String,
default:""

},



verifiedBy:{

type:mongoose.Schema.Types.ObjectId,
ref:"User"

},



verifiedAt:{

type:Date

}



},

{
timestamps:true
}


);



module.exports = mongoose.model(

"EventBooking",

eventBookingSchema

);