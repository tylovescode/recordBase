const mongoose = require('mongoose');

//USER SCHEMA
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        requiired: true
    },
    email: {
        type: String,
        requiired: true
    },
    username: {
        type: String,
        requiired: true
    },
    password: {
        type: String,
        requiired: true
    },
});

const User = module.exports = mongoose.model('User', UserSchema);