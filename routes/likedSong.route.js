const express=require("express");

console.log(
"LIKED SONG ROUTES LOADED"
);

const router=express.Router();


const controller =
require("../controllers/likedSong.controllers");


const verifyToken =
require("../middleware/authMiddleware");




router.post(

"/mnb/api/like-song",

verifyToken,

controller.likeSong

);



// CHECK LIKE STATUS

router.get(

"/mnb/api/check-liked/:songId",

verifyToken,

controller.checkLikedSong

);


router.post(

"/mnb/api/unlike-song",

verifyToken,

controller.unlikeSong

);






router.get(

"/mnb/api/liked-songs",

verifyToken,

controller.getLikedSongs

);





module.exports=router;