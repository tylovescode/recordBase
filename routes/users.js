const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

//Bring in models
const User = require('../models/user');

//Register Form
router.get('/register', (req, res) => {
    res.render('register')
});

//ADD USER Submit POST Route
router.post('/register',
 [
  check('name').isLength({min:1}).trim().withMessage('Name required'),
  check('email').isLength({min:1}).trim().withMessage('Email required'),
  check('email').isEmail().trim().withMessage('Email is not valid'),
  check('password').isLength({min:1}).withMessage('Password required'),
  check('password').custom((value,{req, loc, path}) => {
    if (value !== req.body.password2) {
        // throw error if passwords do not match
        throw new Error("Passwords do not match");
    } else {
        return value;
    }
})
 ],
  (req,res,next)=>{

  let newUser = new User({
  name:req.body.name,
  email:req.body.email,
  username:req.body.username,
  password: req.body.password
 });

 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        if(err) {
            console.log(err);
        } else {
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.username = req.body.username;
        newUser.password = hash;
        }
    })
})

 const errors = validationResult(req);

 if (!errors.isEmpty()) {
  console.log(errors);
     res.render('register',
      { 
       newUser:newUser,
       errors: errors.mapped()
      });
   }
   else {
    

  newUser.save(err=>{
   if(err)throw err;
   req.flash('success','You are now registered and can log in');
   res.redirect('/users/login');
  });
 }
});

router.get('/login', (req, res) => {
    res.render('login');
})

module.exports = router;