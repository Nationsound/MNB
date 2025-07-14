const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers.js");
const { verifyToken } = require("../utils/verifyUser.js"); // only if you need it

router.get('/mnb/api/getAllUsersProfile', userController.getAllUsers);
router.get('/mnb/api/getUserProfile', verifyToken, userController.getSingleUser);
router.put('/mnb/api/updateUserProfile/:id', userController.updateSingleUser);
router.delete('/mnb/api/deleteUserProfile/:id', userController.deleteSingleUser);
router.delete('/mnb/api/deleteAllUsersProfile', userController.deleteAllUsers);
router.post('/mnb/api/newUser', userController.newUser);
router.get('/mnb/api/getUserProfile', verifyToken, userController.getLoggedInUserProfile);

module.exports = router;
