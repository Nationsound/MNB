const express=require("express");

const router=express.Router();


const controller =
require("../controllers/artistFollow.controllers"); 


const verifyToken =
require("../middleware/authMiddleware");






router.post(

"/mnb/api/follow-artist",

verifyToken,

controller.followArtist

);



router.get(

"/mnb/api/check-follow/:artistId",

verifyToken,

controller.checkFollowStatus

);


router.post(

"/mnb/api/unfollow-artist",

verifyToken,

controller.unfollowArtist

);






router.get(

"/mnb/api/followed-artists",

verifyToken,

controller.getFollowedArtists

);





module.exports=router;