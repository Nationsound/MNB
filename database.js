require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewURLParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to mongoDB');
    }catch(error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

// Export connectDB correctly

module.exports = connectDB;   
