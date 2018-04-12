'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const siteDataSchema = mongoose.Schema({
  userId: {type: String, required: true},
  url: {type: String},
  title: {type: String},
  desktopImg: 
      { data: Buffer, contentType: String },
  mobileImg: 
      { data: Buffer, contentType: String },
  tags: {type: String},
  created: {type: Date, default: Date.now}
});

const Website = mongoose.model('site', siteDataSchema);

module.exports = {Website};