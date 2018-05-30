const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//Connect to mongoose
mongoose.connect('mongodb://localhost/recordsbase');
let db = mongoose.connection;

//Check connection
db.once('open', function() {
    console.log('You are now connected to MongoDB');
});

//Check for db errors
db.on('error', function(err) {
    console.log(err);
});

//Initialize app
const app = express();

//Load View Engine - folder where views will be kept
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home Route
app.get('/', (req, res) => {
    let records = [
        {
            id: 1,
            title: 'Dr. Feelgood',
            artist: 'Motley Crue',
            format: 'CD'
        },
        {
            id: 2,
            title: 'Shout at the Devil',
            artist: 'Motley Crue',
            format: 'Vinyl'
        },
        {
            id: 3,
            title: 'Ten',
            artist: 'Pearl Jam',
            format: 'Cassette'
        },
    ]
    res.render('index', {
        title: 'Records',
        records: records
    });
});

//Add records route
app.get('/records/add', (req, res) => {
    res.render('add_record', {
        title: 'Add a Record'
    });
});

app.listen(3000, function() {
    console.log('Server started on port 3000')
});