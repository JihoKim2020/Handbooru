const mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;