const express = require("express");

const router = express.Router();

const upload = require("../multer");

const artistController =
require("../controllers/artistControllers");

const verifyToken =
require("../middleware/authMiddleware");





/*
=====================================
ADMIN ARTIST MANAGEMENT
=====================================
*/


// CREATE ARTIST

router.post(

"/mnb/api/admin/addArtist",

verifyToken,

upload.single("profileImage"),

artistController.createArtist

);






// UPDATE ARTIST

router.put(

"/mnb/api/admin/updateArtist/:id",

verifyToken,

upload.single("profileImage"),

artistController.updateArtist

);






// DELETE ARTIST

router.delete(

"/mnb/api/admin/deleteArtist/:id",

verifyToken,

artistController.deleteArtist

);









/*
=====================================
PUBLIC MUSIC ROUTES
=====================================
*/


// ALL ARTISTS

router.get(

"/mnb/api/artists",

artistController.getAllArtists

);






// ARTIST DETAILS

router.get(

"/mnb/api/artists/:slug",

artistController.getArtistBySlug

);









/*
=====================================
TEMPORARY LEGACY SUPPORT
Remove after frontend migration
=====================================
*/


router.post(

"/mnb/api/addArtist",

verifyToken,

upload.single("image"),

artistController.createArtist

);



router.get(

"/mnb/api/getAllArtist",

artistController.getAllArtists

);



router.put(

"/mnb/api/updateArtist/:id",

verifyToken,

upload.single("image"),

artistController.updateArtist

);



router.delete(

"/mnb/api/deleteArtist/:id",

verifyToken,

artistController.deleteArtist

);






module.exports = router;