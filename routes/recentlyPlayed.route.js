const express=require("express");

const router=express.Router();


const recentlyPlayedController =
require("../controllers/recentlyPlayed.controllers");


const verifyToken =
require("../middleware/authMiddleware");





router.post(

"/mnb/api/add-recently-played",

verifyToken,

recentlyPlayedController.addRecentlyPlayed

);





router.get(

"/mnb/api/recently-played",

verifyToken,

recentlyPlayedController.getRecentlyPlayed

);





module.exports=router;