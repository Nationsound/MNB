const axios = require("axios");



const searchYouTube = async(query)=>{


try{


const response = await axios.get(

"https://www.googleapis.com/youtube/v3/search",

{

params:{


key:process.env.YOUTUBE_API_KEY,


part:"snippet",


q:query,


type:"video",


maxResults:10


}


}

);



return response.data.items;



}

catch(error){


console.log(

"YOUTUBE SERVICE ERROR:",

error.response?.data || error.message

);


throw error;


}


};






module.exports = {

searchYouTube

};