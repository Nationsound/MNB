// Example of a Protected Route
// Modify routes/protectedRoutes.js to use the middleware:

const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

router.get('/mnb/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to the protected route!' });
});

module.exports = router;


// ✅ How It Works
// User signs in: The server validates credentials and stores userId in req.session.
// Session stored in MongoDB: The session is saved in MongoDB, and the client gets a session cookie.
// User accesses protected routes: The server checks req.session.userId before allowing access.
// User logs out: The session is destroyed, logging the user out.

// Notes
// Session-Based Authentication: Sessions are stored in MongoDB using connect-mongo.
// Session Management: req.session.destroy() handles logout and removes the session from the database.
// Bcrypt for Security: Passwords are safely compared using bcrypt.compare.

// Test Access to Protected Routes
// Once signed in, you can try accessing a protected route:

// Method: GET
// URL: http://localhost:3000/nodeapp/api/protected
// Headers: Postman should automatically send the session cookie.
// Send: Click Send.
// If the session is valid, you should see: