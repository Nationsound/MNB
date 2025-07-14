const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 1990;
require('dotenv').config();
const connectDB = require('./database.js');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.route.js");
const protectedRoutes = require('./routes/protectedRoutes.js');
const commentRoutes = require('./routes/comment.route.js'); // Adjust the path as necessary
const postRoutes = require("./routes/post.route.js");
const songRoutes = require('./routes/song.route.js');
const adminRoutes = require('./routes/admin.route.js');
const smartLinkRoutes = require('./routes/smartLink.route.js');
const userProfileRoutes = require('./routes/userProfile.route.js');
const cors = require('cors');
const path = require('path');
// const upload = require('./upload'); 



app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true, // Allow credentials (cookies, headers, etc.)
}));

 



// Routes (after CORS and middleware)
app.use("/mnb/api", require("./routes/auth.route.js")); // for example


// Handle errors globally
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Something went wrong' });
});


app.use(cookieParser());
app.set('view engine', 'ejs');

// Connect to the database
connectDB();

// Define Routes
app.get('/', (req, res) => {
  res.send("Welcome to MNB APLs Backend Application");
});


// Define comment routes
app.use('/', commentRoutes); // Routes will be under /api/comments

// Define auth routes
app.use('/', authRoutes);

// Define protected routes
app.use('/', protectedRoutes);
// Define post routes
app.use('/', postRoutes);
//Define song routes
app.use('/', songRoutes);
//Define admin routes
app.use('/', adminRoutes);
//Define smarkLink routes
app.use(smartLinkRoutes);
//Define user profile routes
app.use('/', userProfileRoutes);

// Add route for file uploads (e.g., profile picture update)
// app.post('/upload', upload.single('profilePicture'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     // File uploaded successfully
//     res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ message: 'Error uploading file', error: error.message });
//   }
// });

// Serve static files (uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
