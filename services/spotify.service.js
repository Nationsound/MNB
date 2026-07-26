const axios = require("axios");


let accessToken = null;
let tokenExpiry = null;




const getSpotifyToken = async()=>{


if(
accessToken &&
tokenExpiry &&
Date.now() < tokenExpiry
){

return accessToken;

}



const response =
await axios.post(

"https://accounts.spotify.com/api/token",

new URLSearchParams({

grant_type:
"client_credentials"

}),

{

headers:{


Authorization:

"Basic " +

Buffer.from(

`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`

).toString("base64"),


"Content-Type":
"application/x-www-form-urlencoded"

}


}

);





accessToken =
response.data.access_token;


tokenExpiry =
Date.now() +
(
response.data.expires_in * 1000
);




return accessToken;


};








const spotifySearch = async(query)=>{


const token =
await getSpotifyToken();



const response =
await axios.get(

"https://api.spotify.com/v1/search",

{

params:{


q:query,


type:
"artist,track",


limit:20


},


headers:{


Authorization:
`Bearer ${token}`


}


}

);





return response.data;


};






module.exports={
spotifySearch
};