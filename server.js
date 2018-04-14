'use strict';

const bodyParser = require('body-parser'); 
const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

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

// GET one website by id
app.get('/websites/:id', (req, res) => {
  Website
    .findById(req.params.id)
    .then(websites => {
      res.json(websites)})
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// GET websites by tag
/*
app.get('/websites/filter', (req, res) => {
  Website
    .find({tags: ${input}}
    .then(websites => {
      res.json(websites)})
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
*/

// POST a new webiste
app.post('/websites', (req, res) => {
  const requiredFields = ['userId', 'url'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
// Grab title and images, add to db
  Website
    .create({
      userId: req.body.userId,
      url: req.body.url,
      tags: req.body.tags
    })
    .then(websites => {
      res.json(websites)})
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });

});

// PUT edit existing tags 
app.put('/websites/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['tags'];
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