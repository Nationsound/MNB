const express = require("express");

const router = express.Router();

const mnbUserControllers = require("../controllers/mnbUser.controllers");

const { verifyToken } = require("../utils/verifyUser");




// =======================================
// CREATE MNB USER PROFILE
// =======================================

router.post(
  "/mnb/api/create-mnb-user",
  verifyToken,
  mnbUserControllers.createMNBUser
);

// =======================================
// CHECK USER PROFILE
// =======================================

router.get(
  "/mnb/api/check-mnb-profile",
  verifyToken,
  mnbUserControllers.checkMNBProfile
);

// =======================================
// GET USER PROFILE
// =======================================

router.get(
  "/mnb/api/getMNBUserProfile",
  verifyToken,
  mnbUserControllers.getMNBUserProfile
);




// =======================================
// UPDATE USER PROFILE
// =======================================

router.put(
  "/mnb/api/updateMNBUserProfile",
  verifyToken,
  mnbUserControllers.updateMNBUserProfile
);




// =======================================
// DELETE USER PROFILE
// =======================================

router.delete(
  "/mnb/api/deleteMNBUserProfile",
  verifyToken,
  mnbUserControllers.deleteMNBUserProfile
);




// =======================================
// USER DASHBOARD
// =======================================

router.get(
  "/mnb/api/getUserDashboard",
  verifyToken,
  mnbUserControllers.getUserDashboard 
);


// =======================================
// CHANGE USER PASSWORD
// =======================================

router.put(
  "/mnb/api/changePassword",
  verifyToken,
  mnbUserControllers.changePassword
);


module.exports = router;