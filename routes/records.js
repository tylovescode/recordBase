const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')

//Bring in models
const Record = require('../models/records');



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
  artist:req.body.artist,
  format:req.body.format
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
  record.artist = req.body.artist;
  record.format = req.body.format;

  record.save(err=>{
   if(err)throw err;
   req.flash('success','Record Added');
   res.redirect('/');
  });
 }
});


//Add records route
router.get('/add', (req, res) => {
    res.render('add_record', {
        title: 'Add a Record'
    });
});

//Load edit form
router.get('/edit/:id', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
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
    let query = {_id:req.params.id}

    Record.remove(query, (err) => {
        if(err) {
            console.log(err);
        }
        //Status 200 is default, so just send message
        res.send('Success');
        });
    });

    //Get single record
router.get('/:id', (req, res) => {
    Record.findById(req.params.id, (err, record) => {
        res.render('record', {
            record: record
        });
    });
});

module.exports = router;