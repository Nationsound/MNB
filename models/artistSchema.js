const mongoose = require("mongoose");
const slugify = require("slugify");


const artistSchema = new mongoose.Schema(
{

name:{
type:String,
required:true,
trim:true
},


slug:{
type:String,
unique:true,
index:true,
trim:true
},



bio:{
type:String,
trim:true,
default:""
},



profileImageUrl:{
type:String,
default:""
},


profileImagePublicId:{
type:String,
default:""
},



coverImageUrl:{
type:String,
default:""
},


coverImagePublicId:{
type:String,
default:""
},




genre:[
{
type:String
}
],




country:{
type:String,
default:"Nigeria"
},




socialLinks:{


instagram:{
type:String,
default:""
},


twitter:{
type:String,
default:""
},


youtube:{
type:String,
default:""
},


spotify:{
type:String,
default:""
}



},




featured:{
type:Boolean,
default:false
},




verified:{
type:Boolean,
default:false
},





followers:{
type:Number,
default:0
},




// Music statistics

streams:{
type:Number,
default:0
},


monthlyListeners:{
type:Number,
default:0
},


views:{
type:Number,
default:0
},




// future artist account

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null
},



},

{
timestamps:true
}

);





artistSchema.pre(
"save",
function(next){


if(
!this.isModified("name")
&& this.slug
){

return next();

}



this.slug =
slugify(
this.name,
{
lower:true,
strict:true
}
);



next();


});




module.exports =
mongoose.model(
"Artist",
artistSchema
);