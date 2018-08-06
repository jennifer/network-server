'use strict';

require('dotenv').load();

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('../config');
const router = express.Router();

const { Network } = require('./models');

const jwtAuth = passport.authenticate('jwt', { session: false });

// Company endpoints

// GET all company details
router.get('companies/:username', jwtAuth, (req, res) => {
  Network
    .find({username:req.params.username})
    .then(companies => {
      res.json(companies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST a new company
router.post('/companies', jwtAuth, (req, res) => {
  const requiredFields = ['name,', 'url', 'locationString'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Network
    .create({
      name: req.body.name,
      url: req.body.url,
      location: {
        city: req.body.city,
        state: req.body.state
      },
      description: req.body.description,
      notes: req.body.notes
    })
    .then(company => res.status(201).json(companies))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
  });
});

// PUT edit a company
router.put('companies/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'url', 'locationString', 'description', 'notes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Network
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedCompany => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// DELETE a website
router.delete('companies/:id', jwtAuth, (req, res) => {
  Network
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ 
        message: 'Success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Internal server error'
      });
    });
});

// Person endpoints

// GET all person details
router.get('people/:username', jwtAuth, (req, res) => {
  Network
    .find({username:req.params.username})
    .then(companies => {
      res.json(companies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// POST a new company
router.post('/people', jwtAuth, (req, res) => {
  const requiredFields = ['name,', 'url', 'locationString'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Network
    .create({
      name: req.body.name,
      url: req.body.url,
      location: {
        city: req.body.city,
        state: req.body.state
      },
      description: req.body.description,
      notes: req.body.notes
    })
    .then(company => res.status(201).json(companies))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
  });
});

// PUT edit a company
router.put('people/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'url', 'locationString', 'description', 'notes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Network
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedCompany => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


// DELETE a website
router.delete('people/:id', jwtAuth, (req, res) => {
  Network
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ 
        message: 'Success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Internal server error'
      });
    });
});

module.exports = { router };