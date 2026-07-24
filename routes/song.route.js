const express = require("express");

const router = express.Router();

const songController =
require("../controllers/song.controllers.js");

const upload =
require("../multer.js");

const verifyToken =
require("../middleware/authMiddleware");





// ================================
// VALIDATE SLUG
// ================================

function ensureSlugParam(req,res,next){

if(
!req.params.slug ||
typeof req.params.slug !== "string"
){

return res.status(400).json({

message:"Slug is required"

});

}


next();

}








// ================================
// ADMIN CREATE SONG
// ================================


router.post(

"/mnb/api/createSong",

(req,res,next)=>{
        console.log("CREATE SONG ROUTE HIT");
        next();
    },

verifyToken,


upload.fields([

{
name:"audio",
maxCount:1
},

{
name:"coverImage",
maxCount:1
}

]),


songController.createSong

);


// =================================
// PUBLIC GET ALL SONGS
// =================================


router.get(

"/mnb/api/songs",

songController.getAllSongs 

);



router.get(

"/mnb/api/getAllSongs",

songController.getAllSongs

);




// =================================
// PUBLIC SINGLE SONG
// =================================


router.get(

"/mnb/api/songs/:slug",

ensureSlugParam,

songController.getSongBySlug

);



router.get(

"/mnb/api/getSongBySlug/:slug",

ensureSlugParam,

songController.getSongBySlug

);




// =================================
// ADMIN UPDATE SONG
// =================================


router.put(

"/mnb/api/admin/updateSong/:slug",

verifyToken,


ensureSlugParam,


upload.fields([

{
name:"audio",
maxCount:1
},

{
name:"coverImage",
maxCount:1
}

]),


songController.updateSong

);









// =================================
// ADMIN DELETE SONG
// =================================


router.delete(

"/mnb/api/admin/deleteSong/:slug",

verifyToken,


ensureSlugParam,


songController.deleteSong

);









// =================================
// STREAM SONG
// =================================


router.get(

"/mnb/api/music/stream/:id",

songController.streamSong

);









// =================================
// DOWNLOAD SONG
// =================================


router.get(

"/mnb/api/music/download/:id",

songController.downloadSong

);



router.get(
"/mnb/api/getTrendingSongs",
songController.getTrendingSongs
);


router.get(
"/mnb/api/getLatestSongs",
songController.getLatestSongs
);


router.get(
"/mnb/api/getFeaturedSong",
songController.getFeaturedSong
);



router.get(

"/mnb/api/music/genre/:genre",

songController.getSongsByGenre

);

module.exports = router;