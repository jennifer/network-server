'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const companySchema = mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true, lowercase: true, trim: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  description: { type: String, required: true },
  notes: String
});

companySchema.virtual('locationString').get(function() {
  return `${this.location.city} ${this.location.state}`.trim();});

const Company = mongoose.model('company', companySchema);


const personSchema = mongoose.Schema({
  username: { type: String, required: true },
  company_id: { type: String, required: true },
  status: { type: Number, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  title: String,
  url: { type: String, lowercase: true, trim: true },
  date: Date,
  method: String,
  notes: String
});

personSchema.virtual('nameString').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();});

const Person = mongoose.model('person', personSchema);


module.exports = { Company, Person };