const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');

//Connect to mongoose
mongoose.connect(config.database);
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

//Express Session Middleware
app.use(session({
    secret:'keyboardcat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


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

//Route Files
let records = require('./routes/records');
let users = require('./routes/users');
app.use('/records', records);
app.use('/users', users);

//Start Server
app.listen(3000, function() {
    console.log('Server started on port 3000')
});