const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = isAuthenticated;
