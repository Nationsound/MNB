const User = require("../models/userSchema");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "error fetching datas", error })
    }
}

const getSingleUser = async (req, res) => {
     try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
};

const updateSingleUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.pasword,
            age: req.body.age,
            nationality: req.body.nationality,
            origin: req.body.nationality
        },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: "error updating user", error })
    }
}

const deleteSingleUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) {
            return res.status(404).json({ message: "user not found" })
        }
       res.status(200).json({message: "user deleted successful"})
    } catch (error) {
        res.status(500).json({ message: "error deleting user", error })
    }
}
const deleteAllUsers = async (req, res) => {
    try {
        const deletedUsers = await User.deleteMany();
        if (deletedUsers.deletedCount === 0) {
          return res.status(404).json({ message: 'No users found' });
        }
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting users', error: error.message });
      }
}

const newUser = async (req, res) => {
    try {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          age: req.body.age
        });       
        const savedUser = await newUser.save(); // Save the new user to the database
        res.status(201).json(savedUser); // Respond with the saved user data
      } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
      }
};

const getLoggedInUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // omit password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    updateSingleUser,
    deleteSingleUser,
    deleteAllUsers,
    newUser,
    getLoggedInUserProfile,
}