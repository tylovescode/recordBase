const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')

//Bring in models
const Record = require('../models/records');
const User = require('../models/user');



//ADD RECORD Submit POST Route
router.post('/add',
 [
  check('title').isLength({min:1}).trim().withMessage('Title required'),
  check('artist').isLength({min:1}).trim().withMessage('Artist required'),
  check('format').isLength({min:1}).trim().withMessage('Format required')
 ],
  (req,res,next)=>{

  let record = new Record({
  title:req.body.title,
  author: req.user._id,
  artist:req.body.artist,
  format:req.body.format,
  notes: req.body.notes
 });

 const errors = validationResult(req);

 if (!errors.isEmpty()) {
  console.log(errors);
     res.render('add_record',
      { 
       record:record,
       errors: errors.mapped()
      });
   }
   else{
  record.title = req.body.title;
  record.author = req.user._id;
  record.artist = req.body.artist;
  record.format = req.body.format;
  record.notes = req.body.notes;

  record.save(err=>{
   if(err)throw err;
   req.flash('success','Record Added');
   res.redirect('/');
  });
 }
});


//Add records route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_record', {
        title: 'Add a Record'
    });
});

//Load edit form
//ensureAuthenticated protects route - user must be logged in to access
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        if(record.author != req.user._id) {
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }
        res.render('edit_record', {
            title: 'Edit Record',
            record: record
        });
    });
});

//UPDATE Submit POST Route
router.post('/edit/:id', (req, res) => {
    //Set record to an empty object, then add to it
    let record = {};
    record.title = req.body.title;
    record.artist = req.body.artist;
    record.format = req.body.format;
    record.notes = req.body.notes;

    let query = {_id:req.params.id}

    //Using the model this time to update record
    Record.update(query, record, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Record Updated');
            res.redirect('/');
        }
    });
});

//DELETE request
router.delete('/:id', (req, res) => {
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Record.findById(req.params.id, function(err, record) {
        if(record.author != req.user._id){
            res.status(500).send();
        } else {
            Record.remove(query, (err) => {
                if(err) {
                    console.log(err);
                }
                //Status 200 is default, so just send message
                res.send('Success');
                });
        }
    })


    });

    //Get single record
router.get('/:id', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        User.findById(record.author, (err, user) => {
            res.render('record', {
                record: record,
                author: user.name
            });
        })
        
    });
});

//Access control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please log in');
        res.redirect('/users/login');
    }
}

module.exports = router;