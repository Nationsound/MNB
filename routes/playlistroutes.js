const express = require("express");


const router = express.Router();



const playlistController =
require("../controllers/playlist.controllers");



const verifyToken =
require("../middleware/authMiddleware");




console.log("PLAYLIST ROUTES LOADED");




// CREATE PLAYLIST

router.post(

"/mnb/api/create-playlist",

(req,res,next)=>{

console.log(
"CREATE PLAYLIST ROUTE HIT"
);

next();

},

verifyToken,

(req,res,next)=>{

console.log(
"USER AFTER AUTH:",
req.user
);

next();

},

playlistController.createPlaylist

);









// GET USER PLAYLISTS

router.get(

"/mnb/api/user-playlists",

verifyToken,

playlistController.getUserPlaylists

);









// ADD SONG TO PLAYLIST

router.post(

"/mnb/api/add-song-to-playlist",

verifyToken,

playlistController.addSongToPlaylist

);









// REMOVE SONG FROM PLAYLIST

router.post(

"/mnb/api/remove-song-from-playlist",

verifyToken,

playlistController.removeSongFromPlaylist

);









// DELETE PLAYLIST

router.delete(

"/mnb/api/delete-playlist/:id",

verifyToken,

playlistController.deletePlaylist

);








module.exports = router;