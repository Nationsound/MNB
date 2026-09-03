const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
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
// const userProfileRoutes = require('./routes/userProfile.route.js');
const artistRoutes = require('./routes/artists.route.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const styleSpotLightRoutes = require('./routes/styleSpotLightRoutes.js');
const partnershipRoutes = require('./routes/partnershipRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const teamRoutes = require('./routes/teamRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const subscriberRoutes = require('./routes/subscriberRoutes.js');
const adverRoutes = require('./routes/advertRoutes.js');
const uploadRouter = require('./upload.js')
const workerRoutes = require('./routes/workerRoutes.js');
const styleSpotlightCommentRoutes = require('./routes/styleSpotlightCommentRoutes.js');
const newsRoutes = require('./routes/news.routes.js');
const eventRoutes = require('./routes/event.routes.js');
const eventBookingRoutes = require('./routes/event.booking.routes.js');
const organizerRoutes = require('./routes/organizer.routes.js');
const mnbUserRoutes = require('./routes/mnbUser.routes.js');
const albumRoutes = require('./routes/album.routes.js');
const musicSearchRoutes = require('./routes/musicSearch.routes.js');
const streamRoutes = require('./routes/stream.route.js');
const playlistRoutes = require('./routes/playlistroutes.js');
const recentlyPlayedRoutes = require('./routes/recentlyPlayed.route.js');
const artistFollowRoutes = require('./routes/artistFollow.route.js');
const likedSongRoutes = require('./routes/likedSong.route.js');
const externalSearchRoutes = require("./routes/externalSearch.route.js");





// Server port
const port = process.env.PORT || 1990;

// ✅ 2. Global CORS (for API routes)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mnb-pqef.onrender.com/", "https://www.mynationblog.com", "https://my-nation-blog-wp4o.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);


const allowedOrigins = [
  "http://localhost:5173",
  "https://www.mynationblog.com",
  "https://mnb-pqef.onrender.com",
  "https://my-nation-blog-wp4o.vercel.app"
];

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // set CORS for each request
    const origin = res.req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Credentials', 'true');
    }
  }
}));

// ✅ 3. Built-in middlewares
app.use(express.json());
app.use(cookieParser());

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
// app.use('/', userProfileRoutes);
app.use('/', artistRoutes);
app.use('/', bookingRoutes);
app.use('/', paymentRoutes);
app.use('/', styleSpotLightRoutes);
app.use('/', partnershipRoutes);
app.use('/', adminRoutes);
app.use('/', teamRoutes);
app.use('/', contactRoutes);
app.use('/mnb/api', subscriberRoutes);
app.use('/', adverRoutes);
app.use('/', uploadRouter);
app.use('/', workerRoutes);
app.use('/', styleSpotlightCommentRoutes);
app.use('/', newsRoutes);
app.use('/', eventRoutes);
app.use('/', eventBookingRoutes);
app.use('/', organizerRoutes);
app.use('/', mnbUserRoutes);
app.use('/', albumRoutes);
app.use('/', musicSearchRoutes);
app.use('/', streamRoutes);
app.use('/', playlistRoutes);
app.use('/', recentlyPlayedRoutes);
app.use('/', artistFollowRoutes);
app.use('/', likedSongRoutes);
app.use("/", externalSearchRoutes);






// ✅ 8. Global error handler (last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.set(
"Cache-Control",
"no-store"
);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Something went wrong' });
});
// ✅ 9. Start server
app.listen(port, '0.0.0.0', () => { // ✅ bind to 0.0.0.0 for Railway / production
  console.log(`🚀 Server running at: http://localhost:${port}`);
});
