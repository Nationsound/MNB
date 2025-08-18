const express = require("express");
const router = express.Router();

const styleSpotlightCommentController = require("../controllers/styleSpotlightCommentControllers");

// ✅ Add general spotlight comment
router.post(
  "/mnb/api/style-spotlight/comment",
  styleSpotlightCommentController.addGeneralComment
);

// ✅ Fetch all spotlight comments (general)
router.get(
  "/mnb/api/style-spotlight/comments",
  styleSpotlightCommentController.getGeneralComments
);

// Keep the old id-based ones if you still want to support them later
router.post(
  "/mnb/api/style-spotlight/:id/comment",
  styleSpotlightCommentController.addComment
);
router.get(
  "/mnb/api/style-spotlight/:id/comments",
  styleSpotlightCommentController.getComments
);
router.post(
  "/mnb/api/style-spotlight/comment/:id/reply",
  styleSpotlightCommentController.addReply
);
router.patch(
  "/mnb/api/style-spotlight/comment/:id/reaction",
  styleSpotlightCommentController.updateReaction
);

// routes/styleSpotlightCommentRoutes.js
router.delete(
  "/mnb/api/style-spotlight/comment/:id",
  styleSpotlightCommentController.deleteComment
);

// Delete all comments
router.delete(
  "/mnb/api/style-spotlight/comments",
  styleSpotlightCommentController.deleteAllComments
);

module.exports = router;
