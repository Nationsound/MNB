const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  genre: { 
    type: String, 
    required: true 
},
  imageUrl: { 
    type: String 
}, // store the file path or URL
  createdAt: { 
    type: Date, 
    default: Date.now
 }
});

module.exports = mongoose.model('Artist', artistSchema);
