const express = require("express");

const router = express.Router();

const albumControllers =
require("../controllers/albumControllers");

const verifyToken =
require("../middleware/authMiddleware.js");

const upload =
require("../multer.js");





// =====================================
// CREATE ALBUM WITH MULTIPLE SONGS
// =====================================
// Upload album cover + multiple MP3 files

router.post(

"/mnb/api/music/albums",

verifyToken,

upload.fields([

{
name:"coverImage",
maxCount:1
},

{
name:"songs",
maxCount:50
}

]),

albumControllers.createAlbum

);









// =====================================
// GET ALL ALBUMS
// =====================================
// Public music archive


router.get(

"/mnb/api/music/albums",

albumControllers.getAllAlbums

);









// =====================================
// GET SINGLE ALBUM
// =====================================
// Public album details + tracks


router.get(

"/mnb/api/music/albums/:slug",

albumControllers.getAlbumBySlug

);









// =====================================
// UPDATE ALBUM
// =====================================
// Update details or cover image


router.patch(

"/mnb/api/music/albums/:id",

verifyToken,

upload.fields([

{
name:"coverImage",
maxCount:1
}

]),

albumControllers.updateAlbum

);









// =====================================
// DELETE ALBUM
// =====================================


router.delete(

"/mnb/api/music/albums/:id",

verifyToken,

albumControllers.deleteAlbum

);






module.exports = router;