const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://www.google.com/imgres?q=blank%20profile%20images&imgurl=https%3A%2F%2Fcdn.vectorstock.com%2Fi%2F500p%2F54%2F17%2Fperson-gray-photo-placeholder-man-vector-24005417.jpg&imgrefurl=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fblank-profile-portrait-man-vectors&docid=PWy8OTJUw4dxhM&tbnid=oj8CXZJNB3o0VM&vet=12ahUKEwjwhYWep8iMAxUwZkEAHaxJOl4QM3oECBcQAA..i&w=500&h=500&hcb=2&ved=2ahUKEwjwhYWep8iMAxUwZkEAHaxJOl4QM3oECBcQAA"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });  // Fixed 'timestamp' to 'timestamps'

const Auth = mongoose.model('Auth', authSchema);  // Fixed typo here

module.exports = Auth;
