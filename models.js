'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const siteDataSchema = mongoose.Schema({
  userId: String,
  url: {type: String, required: true, lowercase: true, trim: true},
  title: String,
  desktopImg: 
      { data: Buffer, contentType: String },
  mobileImg: 
      { data: Buffer, contentType: String },
  tags: {type: String},
  created: {type: Date, default: Date.now}
});

const Website = mongoose.model('website', siteDataSchema);

module.exports = {Website};