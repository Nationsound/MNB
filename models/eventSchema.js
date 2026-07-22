const mongoose = require("mongoose");


const ticketSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true,
    trim:true
  },


  price:{
    type:Number,
    required:true,
    min:0
  },


  quantity:{
    type:Number,
    required:true,
    min:1
  },


  salesStart:{
    type:Date,
    required:false
  },


  salesEnd:{
    type:Date,
    required:false
  },


  sold:{
    type:Number,
    default:0
  }


});





const organizerSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true,
    trim:true
  },


  email:{
    type:String,
    trim:true
  },


  phone:{
    type:String,
    trim:true
  },


  company:{
    type:String,
    trim:true
  }


},{_id:false});







const eventSchema = new mongoose.Schema({


title:{

  type:String,
  required:true,
  trim:true

},

slug:{
 type:String,
 unique:true,
 required:true
},

description:{

  type:String,
  required:true

},



date:{

  type:Date,
  required:true

},



time:{

  type:String,
  required:true

},



venue:{

  type:String,
  required:true,
  trim:true

},



category:{

  type:String,
  required:true

},




organizerType:{
  type:String,

  enum:[
    "My Nation Events",
    "External Organizer",
    "Partnership"
  ],

  required:true
},




organizer:{

  type:organizerSchema,

  required:true

},





approvalStatus:{

  type:String,

  enum:[
    "pending",
    "approved",
    "rejected"
  ],

  default:"pending"

},





imageUrl:{

  type:String,
  required:true

},



imagePublicId:{

  type:String

},





galleryImages:[

{

url:String,

publicId:String

}

],






ticketTypes:[

ticketSchema

],



organizerProfile:{

type:mongoose.Schema.Types.ObjectId,

ref:"Organizer",

required:false

},





createdBy:{

type:mongoose.Schema.Types.ObjectId,

ref:"Auth",

required:false

},


status:{

type:String,

enum:[
"draft",
"published",
"archived"
],

default:"draft"

},


archivedAt:{

type:Date,

default:null

},


},{

timestamps:true

});





module.exports = mongoose.model(
"Event",
eventSchema
);