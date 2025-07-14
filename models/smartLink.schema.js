const mongoose = require('mongoose');

const smartLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String }, // store filename or URL
  youtube: { type: String },
  spotify: { type: String },
  boomplay: { type: String },
  appleMusic: { type: String },
  audiomack: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SmartLink', smartLinkSchema);
