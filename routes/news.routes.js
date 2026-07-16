const express = require("express");
const router = express.Router();

const newsController = require("../controllers/news.controllers.js");
const { verifyToken } = require("../utils/verifyUser");
const upload = require("../multer.js");


// Create news article
// Create news article
router.post(
  "/mnb/api/addNews",
  verifyToken,
  upload.fields([
    {
      name: "image",
      maxCount: 1
    },
    {
      name: "galleryImages",
      maxCount: 15
    }
  ]),
  newsController.createNews
);



// Update news article
router.put(
  "/mnb/api/updateNews/:id",
  verifyToken,
  upload.fields([
    {
      name: "image",
      maxCount: 1
    },
    {
      name: "galleryImages",
      maxCount: 15
    }
  ]),
  newsController.updateNews
);

// Get news article by ID
router.get(
  "/mnb/api/getNewsById/:id",
  newsController.getNewsById
);


// Delete news article
router.delete(
  "/mnb/api/deleteNews/:id",
  verifyToken,
  newsController.deleteNews
);


// Get all news
router.get(
  "/mnb/api/getAllNews",
  newsController.getAllNews
);


// Get single news article by slug
router.get(
  "/mnb/api/getNews/:slug",
  newsController.getNewsBySlug
);


// Get featured news (Hero Section)
router.get(
  "/mnb/api/getFeaturedNews",
  newsController.getFeaturedNews
);


// Get breaking news (Ticker)
router.get(
  "/mnb/api/getBreakingNews",
  newsController.getBreakingNews
);


// Get trending news
router.get(
  "/mnb/api/getTrendingNews",
  newsController.getTrendingNews
);


// Get latest news
router.get(
  "/mnb/api/getLatestNews",
  newsController.getLatestNews
);


// Get news by category
router.get(
  "/mnb/api/getNewsByCategory/:category",
  newsController.getNewsByCategory
);


// Get news by category and subcategory
router.get(
  "/mnb/api/getNewsBySubCategory/:category/:subCategory",
  newsController.getNewsBySubCategory
);


// Search news
router.get(
  "/mnb/api/searchNews",
  newsController.searchNews
);


module.exports = router;