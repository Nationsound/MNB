const express = require("express");

const router = express.Router();

const musicSearchControllers =
require("../controllers/musicSearchControllers");



router.get(
"/mnb/api/music/search",
musicSearchControllers.searchMusic
);



module.exports = router;