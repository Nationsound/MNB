const express = require("express");
const router = express.Router();
const authControllers = require('../controllers/auth.controllers.js');
const { verifyToken } = require("../utils/verifyUser.js"); 
const upload = require('../upload.js');

  

router.post('/mnb/api/signUp', authControllers.signUp);
router.post('/mnb/api/signIn', authControllers.signIn);
router.post('/mnb/api/signOut', authControllers.signOut);
router.delete('/mnb/api/deleteUserProfile/:id', verifyToken, authControllers.deleteUserProfile);
router.post('/mnb/api/request-password-reset', authControllers.requestPasswordReset);
router.post('/mnb/api/reset-password', authControllers.resetPassword);


// Route for fetching user profile (GET)
router.get('/mnb/api/getUserProfile', verifyToken, authControllers.getUserProfile);

// Route for updating user profile (PUT)
router.put('/mnb/api/updateUser/:id', upload.single('profilePicture'), authControllers.updateUser);



module.exports = router;