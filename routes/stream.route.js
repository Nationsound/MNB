const express = require("express");


const router =
express.Router();


const streamController =
require("../controllers/stream.controllers");



router.post(

"/mnb/api/record",

streamController.recordStream

);



module.exports = router;