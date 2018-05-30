const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

//Bring in models
const Record = require('./models/records');

//Load View Engine - folder where views will be kept
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/', (req, res) => {
    Record.find({}, (err, records) => {
        if (err) {
            console.log(err);
        } else {
        res.render('index', {
            title: 'Records',
            records: records
        });
    }
    });
});

//Get single record
app.get('/record/:id', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        res.render('record', {
            record: record
        });
    });
});

//Add Submit POST Route
app.post('/records/add', (req, res) => {
    let record = new Record();
    record.title = req.body.title;
    record.artist = req.body.artist;
    record.format = req.body.format;

    record.save( (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

//Add records route
app.get('/records/add', (req, res) => {
    res.render('add_record', {
        title: 'Add a Record'
    });
});

//Load edit form
app.get('/record/edit/:id', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        res.render('edit_record', {
            title: 'Edit Record',
            record: record
        });
    });
});

//UPDATE Submit POST Route
app.post('/records/edit/:id', (req, res) => {
    //Set record to an empty object, then add to it
    let record = {};
    record.title = req.body.title;
    record.artist = req.body.artist;
    record.format = req.body.format;

    let query = {_id:req.params.id}

    //Using the model this time to update record
    Record.update(query, record, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

//DELETE request
app.delete('/record/:id', (req, res) => {
    let query = {_id:req.params.id}

    Record.remove(query, (err) => {
        if(err) {
            console.log(err);
        }
        //Status 200 is default, so just send message
        res.send('Success');
        });
    });


//Start Server
app.listen(3000, function() {
    console.log('Server started on port 3000')
});