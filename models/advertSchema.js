const mongoose = require('mongoose');

const advertSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String }, // will store the filename or URL
  link: { type: String }, // optional
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Advert = mongoose.model('Advert', advertSchema);
module.exports = Advert;
