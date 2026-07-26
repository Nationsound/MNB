const { spotifySearch } = require("../services/spotify.service");

const { searchYouTube } = require("../services/youtube.service");





const externalSearch = async(req,res)=>{


try{


const {
q
} = req.query;





if(!q){


return res.status(400).json({

message:"Search query required"

});


}







let spotifyResults = {

artists: [],

songs: []

};





let youtubeResults = [];









// ==========================
// SPOTIFY SEARCH
// ==========================


try{


if(typeof spotifySearch === "function"){


const results = await spotifySearch(q);



spotifyResults = {


artists:
results.artists?.items || [],



songs:
results.tracks?.items || []

};


}


else{


console.log(
"spotifySearch is not a function"
);


}



}


catch(error){


console.log(

"SPOTIFY SEARCH FAILED:",

error.response?.data || error.message

);


}









// ==========================
// YOUTUBE SEARCH
// ==========================


try{


if(typeof searchYouTube === "function"){


youtubeResults =
await searchYouTube(q);


}


else{


console.log(
"searchYouTube is not a function"
);


}



}


catch(error){


console.log(

"YOUTUBE SEARCH FAILED:",

error.response?.data || error.message

);


}









res.status(200).json({


artists:
spotifyResults.artists,



songs:
spotifyResults.songs,



youtube:
youtubeResults



});







}



catch(error){


console.log(

"EXTERNAL SEARCH ERROR:",

error.response?.data || error.message

);



res.status(500).json({

message:"External search failed"

});


}



};









module.exports={

externalSearch

};