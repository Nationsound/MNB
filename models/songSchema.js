const mongoose = require("mongoose");
const slugify = require("slugify");


const songSchema = new mongoose.Schema(

{

title:{
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




// snapshot name for display/backward compatibility

artist:{
type:String,
required:true,
trim:true
},




// linked artist

artistId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Artist",
default:null
},





album:{
type:mongoose.Schema.Types.ObjectId,
ref:"Album",
default:null
},





// old songs compatibility

albumName:{
type:String,
trim:true
},





genre:{
type:String,
required:true,
enum:[

"Afrobeats",
"Hip-Hop",
"Pop",
"R&B",
"Jazz",
"Gospel",
"Classical",
"Rock",
"Electronic",
"Afro-For-All"

]
},






description:{
type:String,
trim:true
},


lyrics:{
type:String,
trim:true,
maxlength:10000,
default:""
},





audioUrl:{
type:String,
required:true
},



audioPublicId:{
type:String,
required:true
},





audioFormat:{
type:String,
enum:[
"mp3"
],
default:"mp3"
},





duration:{
type:String
},





coverImageUrl:{
type:String
},




coverImagePublicId:{
type:String
},






streams:{
type:Number,
default:0
},




downloads:{
type:Number,
default:0
},




likes:{
type:Number,
default:0
},




featured:{
type:Boolean,
default:false
},





releaseDate:{
type:Date,
default:Date.now
},






comments:[

{

_id:false,


username:{
type:String,
trim:true,
default:"Anonymous"
},



text:{
type:String,
trim:true
},



createdAt:{
type:Date,
default:Date.now
}


}

]

},


{
timestamps:true
}

);








songSchema.pre(

"save",

function(next){


if(
!this.isModified("title")
&&
this.slug
){

return next();

}



this.slug = slugify(

`${this.title}-${this.artist}`,

{
lower:true,
strict:true
}

);



next();


}

);







module.exports =
mongoose.model(
"Song",
songSchema
);