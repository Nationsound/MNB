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


  createdAt:{
    type:Date,
    default:Date.now
  }

});


module.exports = mongoose.model(
"MNBUser",
mnbUserSchema
);