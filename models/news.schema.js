const mongoose = require("mongoose");


const newsSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
      trim: true
    },


    slug: {
      type: String,
      required: true,
      unique: true
    },


    content: {
      type: String,
      required: true
    },


    author: {
      type: String,
      required: true
    },


    // Main cover image
    imageUrl: {
      type: String
    },


    imagePublicId: {
      type: String
    },


    // Optional article gallery
    galleryImages: [
      {
        url: {
          type: String
        },

        publicId: {
          type: String
        }
      }
    ],


    category: {
      type: String,
      required: true,
      index: true
    },


    subCategory: {
      type: String
    },


    featured: {
      type: Boolean,
      default: false
    },


    breakingNews: {
      type: Boolean,
      default: false
    },


    trending: {
      type: Boolean,
      default: false
    },


    views: {
      type: Number,
      default: 0
    },


    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },

  {
    timestamps:true
  }

);


// News query optimization
newsSchema.index({ featured: 1, createdAt: -1 });
newsSchema.index({ breakingNews: 1, createdAt: -1 });
newsSchema.index({ trending: 1, createdAt: -1 });
newsSchema.index({ category: 1, createdAt: -1 });
newsSchema.index({ category: 1, subCategory: 1, createdAt: -1 });


module.exports = mongoose.model("News", newsSchema);