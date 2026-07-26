const express =
require("express");


const router =
express.Router();



const controller =
require("../controllers/externalSearchControllers"); 





router.get(

"/mnb/api/music-search",

controller.externalSearch

);





module.exports =
router;