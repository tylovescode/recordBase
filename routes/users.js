const express = require('express');
const router = express.Router();

//Bring in models
const User = require('../models/user');

//Register Form
router.get('/register', (req, res) => {
    res.render('register')
});

module.exports = router;