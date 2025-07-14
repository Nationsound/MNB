const jwt = require('jsonwebtoken');

const adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Dummy hardcoded admin creds
  if (username === "admin" && password === "password123") {
    const user = { username, isAdmin: true };
    const token = jwt.sign(user, process.env.JWT_SECRET || "secretkey", { expiresIn: '2h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { 
    adminLogin,
 };
