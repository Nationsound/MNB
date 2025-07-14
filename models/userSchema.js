// imort mongoose correctly
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true,
        trim: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        trim: true,

    },
    password:{
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    age:{
        type: Number,
        require: true,
    },
    nationality:{
        type: String,
        require: true,
        trim: true,
    },
    origin:{
        type: String,
        require: true,
        trim: true,
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User;