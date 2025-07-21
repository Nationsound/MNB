const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Auth = require('../models/auth.schema');
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/sendEmail') // Function to send emails
const errorHandler = require('../utils/error');



const signUp = async (req, res) => {
  const { firstName, lastName, middleName, username, email, password, age } = req.body;

  // Check for required fields
  if (!firstName || !lastName || !username || !email || !password || username === '' || email === '' || password === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password and create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new Auth({
      firstName,
      lastName,
      middleName,
      username,
      email,
      password: hashedPassword,
      age,
    });

    await newUser.save();

    // Optionally: send confirmation email here
    res.status(201).json({ message: 'User signup successful' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Sign up error' });
  }
};




const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const validUser = await Auth.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin || false },
      process.env.JWT_SECRET
    );

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    
     res.cookie("access_token", token, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        expires: expiryDate,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful",
        token,
        _id: validUser._id, 
        role: validUser.role,
        email: validUser.email
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Controller to get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update User Profile
// Controller to update user profile
const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json({ message: 'You can update only your account' });
  }

  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12); // Hash new password if provided
    }

    const updatedUser = await Auth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          ...(req.body.password && { password: req.body.password }),
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...rest } = updatedUser._doc; // Exclude password from the response
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};


    const signOut = (req, res, next)=>{
      try{
        res.clearCookie('access_token').status(200).json('sign out successful')
      }catch(error){
            next(error)
      }
    }

    const deleteUserProfile = async(req, res, next)=>{
      if (req.user.id !== req.params.id){
        return  next(errorHandler(403, 'you are not allowed to delete this user'))
      }
      try{
        await Auth.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted')
       
      }catch(error){
        next(error)
        

      }
    }

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return next(errorHandler(400, 'Email is required'));
    }

    const user = await Auth.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Reset URL (change to your frontend URL in production)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You requested a password reset. Use the link below:\n${resetUrl}`;
    const html = `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail(user.email, 'Password Reset Request', message, html);

    console.log(`✅ Password reset email sent to ${user.email}`);
    res.status(200).json({ message: 'Reset link sent!' });
  } catch (err) {
    console.error('❌ Error sending password reset email:', err);
    next(errorHandler(500, 'Could not send password reset email'));
  }
};


const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {

    if (!token || !newPassword) {
      console.log('❌ Missing token or newPassword');
      return next(errorHandler(400, 'Token and new password are required'));
    }

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Computed hashedToken:', hashedToken);

    const user = await Auth.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log('User found for password reset:', user);

    if (!user) {
      console.log('❌ No user found or token expired');
      return next(errorHandler(400, 'Invalid or expired token'));
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log(`✅ Password reset successful for user: ${user.email}`);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    next(errorHandler(500, 'Server error'));
  }
};

module.exports = {
  signUp, 
  signIn,
  updateUser,
  signOut,
  deleteUserProfile,
  requestPasswordReset,
  resetPassword,
  getUserProfile,

  // verifyAccount 
};


