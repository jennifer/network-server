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

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;

// POST a new webiste

// PUT edit existing tags (GET/POST/DELETE)

// DELETE a website

// Feature: toggle to show mobile or desktop screenshots
