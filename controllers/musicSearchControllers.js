const Song = require("../models/songSchema");
const Album = require("../models/albumSchema");
const Artist = require("../models/artistSchema");




// ========================================
// GLOBAL MUSIC SEARCH
// ========================================

const searchMusic = async(req,res,next)=>{


try{


const query = req.query.q;


if(!query || query.trim()===""){

return res.status(400).json({

message:"Search query required"

});

}



const regex =
new RegExp(query,"i");





// ==========================
// SONG SEARCH
// ==========================


const songs =
await Song.find({

$or:[

{
title:regex
},

{
artist:regex
},

{
albumName:regex
},

{
genre:regex
}

]

})

.populate({

path:"artistId",

select:"name image avatar profileImage"

})

.limit(30)

.sort({

createdAt:-1

});








// ==========================
// ALBUM SEARCH
// ==========================


const albums =
await Album.find({

$or:[

{
title:regex
},

{
artist:regex
},

{
genre:regex
}

]

})

.limit(30)

.sort({

createdAt:-1

});









// ==========================
// ARTIST SEARCH
// ==========================


let artists=[];


// Try real artists first

if(Artist){


artists =
await Artist.find({

name:regex

})

.select(
"name image avatar profileImage"
)

.limit(20);


}






// fallback for artists without Artist model link

if(
artists.length===0
){


artists=[

...new Set(

[

...songs.map(song=>song.artist),

...albums.map(album=>album.artist)

]

)

]

.map(name=>({

name,

image:null

}));



}









res.json({

success:true,

songs,

albums,

artists

});




}catch(error){


console.log(
"MUSIC SEARCH ERROR:",
error
);


next(error);


}



};






module.exports={

searchMusic

};