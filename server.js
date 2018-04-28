'use strict';

const bodyParser = require('body-parser'); 
const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const urlExists = require('url-exists');
const nodeMetainspector = require('node-metainspector');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Website } = require('./models');


// GET all websites
app.get('/websites', (req, res) => {
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
app.post('/websites', (req, res) => {
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
      let client = new nodeMetainspector(req.body.url, { timeout: 5000 });
        client.on("fetch", function(){
          console.log("Title: " + client.title);
          req.body.title = client.title;
          console.log(req.body.title);
        });
        client.on("error", function(err){
          console.log(err);
        });
        client.fetch();
      // Add new website
      let newWebsite = new Website(req.body);
        newWebsite.save()
        .then(item => {
          res.send('Website added');
        })
        .catch(err => {
          res.status(400).send('Unable to save to database')
        })
      }
      else {
        console.log('URL does not exist');
      }
    })
});

// PUT edit existing tags 
app.put('/websites/:id', (req, res) => {
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
app.delete('/websites/:id', (req, res) => {
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

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };