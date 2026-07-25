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
},


appleMusic:{
type:String,
default:""
},


soundcloud:{
type:String,
default:""
},


tiktok:{
type:String,
default:""
},


website:{
type:String,
default:""
}



},






// Artist status

featured:{
type:Boolean,
default:false
},



verified:{
type:Boolean,
default:false
},





// ==========================
// FOLLOW SYSTEM
// ==========================


followers:{
type:Number,
default:0
},



followersList:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}
],







// ==========================
// STREAM ANALYTICS
// ==========================


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



likes:{
type:Number,
default:0
},





// popularity score
// used for ranking artists

popularityScore:{
type:Number,
default:0
},






// ==========================
// CHART ANALYTICS
// ==========================


weeklyStreams:{
type:Number,
default:0
},



weeklyListeners:{
type:Number,
default:0
},



topCountries:[
{

country:{
type:String
},


listeners:{
type:Number,
default:0
}

}
],




// ==========================
// FUTURE ARTIST ACCOUNT
// ==========================


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