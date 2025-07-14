const mongoose = require('mongoose');

// Define the schema
const songSchema = new mongoose.Schema({
    title: { 
             type: String, 
             required: true 
            },
    artist: { 
              type: String, 
              required: true 
            },
    description: { 
              type: String 

           },
    audioUrl: {
       type: String 
      },       // ✅ new field for audio file path
    coverImage: { 
      type: String
     },
    releaseDate: { 
              type: Date, 
              default: Date.now 
            },
    likes: { 
              type: Number, 
              default: 0 
            },
    comments: [
    {
      _id: false,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
  });
  
  // Create the model
  const Song = mongoose.model('Song', songSchema);
  
  module.exports = Song;