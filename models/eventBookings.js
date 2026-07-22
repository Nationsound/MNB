const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(

{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"Auth",
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
   "rejected",

   "refund_pending",
   "refunded"

 ],

 default:"pending"

},



bookingStatus:{
 type:String,

 enum:[

   "pending",
   "confirmed",
   "cancelled",

   "refund_requested",
   "refunded"

 ],

 default:"pending"

},

refundedAt:{
type:Date,
default:null
},


refundedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Auth",
default:null
},

paymentReference:{
type:String,
default:""
},



paymentProof:{
type:String,
default:""
},



paymentProofPublicId:{
type:String,
default:""
},



ticketNumber:{
type:String,
default:""
},



qrCode:{
type:String,
default:""
},



checkedIn:{
type:Boolean,
default:false
},



checkedInAt:{
type:Date
},



verifiedBy:{

type:mongoose.Schema.Types.ObjectId,

ref:"Auth"

},

checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Auth"
},

verifiedAt:{
type:Date
},

refundReason:{
type:String,
default:""
},


refundRequestedAt:{
type:Date,
default:null
},


refundedAt:{
type:Date,
default:null
},


refundApprovedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Auth",
default:null
},


},

{
timestamps:true
}


);


module.exports = mongoose.model(
"EventBooking",
eventBookingSchema
);