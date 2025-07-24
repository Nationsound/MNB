const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 1990;
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

//Import parts
const connectDB = require('./database.js');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.route.js");
const protectedRoutes = require('./routes/protectedRoutes.js');
const commentRoutes = require('./routes/comment.route.js'); // Adjust the path as necessary
const postRoutes = require("./routes/post.route.js");
const songRoutes = require('./routes/song.route.js');
const smartLinkRoutes = require('./routes/smartLink.route.js');
const userProfileRoutes = require('./routes/userProfile.route.js');
const artistRoutes = require('./routes/artists.route.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const styleSpotLightRoutes = require('./routes/styleSpotLightRoutes.js');
const partnershipRoutes = require('./routes/partnershipRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const teamRoutes = require('./routes/teamRoutes.js');


// ✅ use helmet with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
      imgSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun", "data:"],
      mediaSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
      fontSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"], // adjust if you really need
      styleSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
      connectSrc: ["'self'", 'https://app.mynationblog.fun', 'http://localhost:5173'],
    }
  }
}));



app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://app.mynationblog.fun", "https://mynationblog.fun"], // frontend URL
  credentials: true, // Allow credentials (cookies, headers, etc.)
  methods: ['GET', 'HEAD'],
}), express.static(path.join(__dirname, 'uploads')));
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
  res.send("Welcome to MNB APIs Backend Application");
});


// Serve static files (uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
//Define smarkLink routes
app.use(smartLinkRoutes);
//Define user profile routes
app.use('/', userProfileRoutes);
//Define Artists Routes
app.use('/', artistRoutes);
//Define Booking Routes
app.use('/', bookingRoutes);
//Define payment routes
app.use('/', paymentRoutes);
//Define Style Spotlight Routes
app.use('/', styleSpotLightRoutes);
//Define Partnership Routes
app.use('/', partnershipRoutes);
//Define Admin Routes
app.use('/', adminRoutes);
//Define Team Routes
app.use('/', teamRoutes);


// Start server
app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
