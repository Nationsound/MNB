const express = require("express");
const router = express.Router();
const authControllers = require('../controllers/auth.controllers.js');
const { verifyToken } = require("../utils/verifyUser.js");
const multer = require('multer');
const path = require('path');
const { requestPasswordReset, resetPassword, verifyAccount } = require('../controllers/auth.controllers.js');
const { getUserProfile } = require('../controllers/auth.controllers.js');


// Define the storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext); // Rename file to avoid duplicates
    }
  });
  
  // Create the multer upload instance
  const upload = multer({ storage: storage });

  

router.post('/mnb/api/signUp', authControllers.signUp);
router.post('/mnb/api/signIn', authControllers.signIn);
// router.put('/mnb/api/updateUser/:id', verifyToken, authControllers.updateUser);
router.post('/mnb/api/signOut', authControllers.signOut);
router.delete('/mnb/api/deleteUserProfile/:id', verifyToken, authControllers.deleteUserProfile);
router.post('/mnb/api/requestPasswordReset', authControllers.requestPasswordReset);
router.post('/mnb/api/resetPassword', authControllers.resetPassword);


// Route for fetching user profile (GET)
router.get('/mnb/api/getUserProfile', verifyToken, authControllers.getUserProfile);

// Route for updating user profile (PUT)
router.put('/mnb/api/updateUser/:id', upload.single('profilePicture'), authControllers.updateUser);



module.exports = router;