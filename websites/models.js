'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const siteDataSchema = mongoose.Schema({
  url: { type: String, required: true, lowercase: true, trim: true },
  title: String,
  tags: [],
  notes: String,
  created: { type: Date, default: Date.now }
});

const Website = mongoose.model('website', siteDataSchema);

module.exports = { Website };