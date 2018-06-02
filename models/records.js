const mongoose = require('mongoose');

//Record schema
let recordSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    author: {
        type: String
    }
});

const Record = module.exports = mongoose.model('Record', recordSchema);