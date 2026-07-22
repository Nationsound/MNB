const mongoose = require("mongoose");
const slugify = require("slugify");



const albumSchema = new mongoose.Schema(

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






artist:{

type:String,

required:true,

trim:true

},






artistId:{

type:mongoose.Schema.Types.ObjectId,

ref:"Artist",

default:null

},






description:{

type:String,

trim:true,

default:""

},






genre:[

{

type:String,

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

}

],






albumType:{

type:String,

enum:[

"Single",
"EP",
"Album",
"Mixtape"

],

default:"Album"

},







// Cloudinary album artwork

coverImageUrl:{

type:String,

default:""

},





coverImagePublicId:{

type:String,

default:""

},







releaseDate:{

type:Date,

default:Date.now

},







featured:{

type:Boolean,

default:false

},







// Automatically connected songs

songs:[

{

type:mongoose.Schema.Types.ObjectId,

ref:"Song"

}

],







// Cached song count

totalSongs:{

type:Number,

default:0

}





},


{

timestamps:true

}

);








// ========================================
// AUTO GENERATE SLUG
// ========================================

albumSchema.pre(

"save",

function(next){


if(

this.isModified("title")

||

this.isModified("artist")

||

!this.slug

){


this.slug =

slugify(

`${this.title}-${this.artist}`,

{

lower:true,

strict:true

}

);


}



next();


}

);









// ========================================
// AUTO UPDATE TOTAL SONGS
// ========================================

albumSchema.pre(

"save",

function(next){


this.totalSongs =
this.songs.length;



next();


}

);








module.exports =

mongoose.model(

"Album",

albumSchema

);