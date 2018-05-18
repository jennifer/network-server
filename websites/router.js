'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const nodeMetaInspector = require('node-metainspector');
const passport = require('passport');
const urlExists = require('url-exists');
const webshot = require('webshot');

const config = require('../config');
const router = express.Router();

const { Website } = require('./models');

const jwtAuth = passport.authenticate('jwt', { session: false });

// GET all websites
router.get('/', jwtAuth, (req, res) => {
  Website
    .find()
    .then(websites => {
      res.json(websites);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST a new webiste
router.post('/', jwtAuth, (req, res) => {
  // Check for required fields
  const requiredFields = ['url'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  };
  // Check that URL is valid
  urlExists(req.body.url, function(err, exists) {
    console.log(exists);
    if (exists) {

      // Get URL title
      let client = new nodeMetaInspector(req.body.url, { timeout: 5000 });
      client.on("fetch", function() {
        req.body.title = client.title;
        console.log("DB title: " + req.body.title);


        // Add new website to DB
        let newWebsite = new Website(req.body);
        console.log('New Website: ' + newWebsite);
        newWebsite.save()
          .then(item => {
            res.status(201).send('Website added');
          })
          .catch(err => {
            res.status(500).send('Unable to save to database')
          })
        });
        client.on("error", function(err) {
          console.log(err);
          res.status(500).send('Unable to fetch URL title')
        });
        client.fetch();
    }
    else {
      console.log('URL does not exist');
    };

      // Get full size screenshot
      webshot(req.body.url, 'fullsize.png', function(err) {
        // Add screenshot to website object here
        /*
        mongo.MongoClient.connect(DATABASE_URL, function(err, db) {
          let gfs = Grid(db, mongo);
          let part = './fullsize.png';
          let writeStream = gfs.createWriteStream({
            filename: part.name,
            mode: 'w',
            content_type:part.mimetype
          });
          writeStream.on('close', function() {
            return res.status(200).send({
              message: 'Success'
            });
          });
          writeStream.write(part.name);
          writeStream.end();
        })
        */
      });

      // Get mobile screenshot
      let options = {
        screenSize: {
          width: 320,
          height: 480
        },
        shotSize: {
          width: 320,
          height: 'all'
        },
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
          + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
      };
      webshot(req.body.url, 'mobile.png', options, function(err) {
        // Add screenshot to website object here
      });
  })
});

/*
// POST screenshots to db
app.use(multer({ dest: ‘./uploads/’,
 rename: function (fieldname, filename) {
   return filename;
 },
}));

app.post(‘/api/photo’,function(req,res){
 let newItem = new Item();
 newItem.img.data = fs.readFileSync(req.files.fullsize.path)
 newItem.img.contentType = ‘image/png’;
 newItem.save();
});
*/

// PUT edit existing tags 
router.put('/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['tags', 'notes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Website
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedWebsite => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// DELETE a website
router.delete('/:id', jwtAuth, (req, res) => {
  Website
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'Success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Feature: toggle to show mobile or desktop screenshots

module.exports = { router };
