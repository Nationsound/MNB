const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import database & routes
const connectDB = require('./database.js');
const authRoutes = require('./routes/auth.route.js');
const protectedRoutes = require('./routes/protectedRoutes.js');
const commentRoutes = require('./routes/comment.route.js');
const postRoutes = require('./routes/post.route.js');
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

// Server port
const port = process.env.PORT || 1990;

// ✅ 1. Security middleware: Helmet with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
        imgSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun", "data:", "blob"],
        mediaSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun", "data", "blob"],
        fontSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://app.mynationblog.fun", "https://mynationblog.fun"],
        connectSrc: ["'self'", "https://app.mynationblog.fun", "https://mynationblog.fun", "http://localhost:5173"]
      }
    }
  })
);

// ✅ 2. Global CORS (for API routes)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://app.mynationblog.fun", "https://mynationblog.fun"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // ✅ allow all REST methods you need
  })
);

// ✅ 3. Built-in middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ 4. Serve static uploads with CORS
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://mynationblog.fun'
      ];

      // You can dynamically pick allowedOrigins[0] if in dev, etc.
      res.set('Access-Control-Allow-Origin', 'https://mynationblog.fun');
      res.set('Access-Control-Allow-Credentials', 'true');
    }
  })
);


// ✅ 5. View engine (if used anywhere)
app.set('view engine', 'ejs');

// ✅ 6. Connect database
connectDB();

// ✅ 7. Routes
app.get('/', (req, res) => {
  res.send("Welcome to MNB APIs Backend Application");
});

app.use('/', authRoutes);
app.use('/', protectedRoutes);
app.use('/', commentRoutes);
app.use('/', postRoutes);
app.use('/', songRoutes);
app.use('/', smartLinkRoutes);
app.use('/', userProfileRoutes);
app.use('/', artistRoutes);
app.use('/', bookingRoutes);
app.use('/', paymentRoutes);
app.use('/', styleSpotLightRoutes);
app.use('/', partnershipRoutes);
app.use('/', adminRoutes);
app.use('/', teamRoutes);

// ✅ 8. Global error handler (last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Something went wrong' });
});

console.log('✅ process.env.PORT:', process.env.PORT);
console.log('✅ final port used:', port);

// ✅ 9. Start server
app.listen(port, '0.0.0.0', () => { // ✅ bind to 0.0.0.0 for Railway / production
  console.log(`🚀 Server running at: http://localhost:${port}`);
});
