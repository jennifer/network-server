'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const companySchema = mongoose.Schema({
  username: { type: String, required: true },
  companyName: { type: String, required: true },
  url: { type: String, required: true, lowercase: true, trim: true },
  location: { type: String, required: true },
  description: String,
  notes: String
});

const Company = mongoose.model('company', companySchema);


const personSchema = mongoose.Schema({
  username: { type: String, required: true },
  companyId: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  title: String,
  url: String,
  notes: String
});

personSchema.virtual('nameString').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();});

const Person = mongoose.model('person', personSchema);


module.exports = { Company, Person };