'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const should = chai.should();
const expect = chai.expect();

const { Company } = require('../network/models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

chai.use(chaiHttp);

describe('network API resource', function () {
  const username = 'exampleUser';
  const password = 'examplePass';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedCompanyData();
  });
  afterEach(function () {
    return tearDownDb();
  });
  after(function () {
    return closeServer();
  });

  const token = jwt.sign(
    {
      user: {
        username
      }
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      subject: username,
      expiresIn: '7d'
    }
  );

  function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  }

  let user = faker.lorem.word();
  function seedCompanyData() {
    console.info('seeding company data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        username: user,
        companyName: faker.lorem.words(),
        url: faker.internet.url(),
        location: faker.address.city(),
        description: faker.lorem.sentences(),
        notes: faker.lorem.sentences()
      });
    }
    return Company.insertMany(seedData);
  };

  // Company endpoint tests

  describe('GET companies endpoint', function () {
    it('should return all existing companies', function () {
      let res;
      return chai.request(app)
        .get(`/${user}`)
        .set('authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Company.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });
    
    it('should return companies with right fields', function () {
      let resCompany;
      return chai.request(app)
        .get(`/${user}`)
        .set('authorization', `Bearer ${token}`)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(company) {
            company.should.be.a('object');
            company.should.include.keys('username', 'companyName', 'url', 'location', 'description', 'notes');
          });
          resCompany = res.body[0];
          return Company.findById(resCompany._id);
        })
        .then(company => {
          console.log('company', company);
          resCompany.username.should.equal(company.username);
          resCompany.companyName.should.equal(company.companyName);
          resCompany.url.should.equal(company.url);
          resCompany.location.should.equal(company.location);
          resCompany.description.should.equal(company.description);
          resCompany.notes.should.equal(company.notes);
        });
    });
  });

  describe('POST endpoint', function () {
    it('should add a new company', function () {
      const newCompany = {
        username: user,
        companyName: faker.lorem.words(),
        url: faker.internet.url(),
        location: faker.address.city(),
        description: faker.lorem.sentences(),
        notes: faker.lorem.sentences()
      };
      return chai.request(app)
        .post('/')
        .set('authorization', `Bearer ${token}`)
        .send(newCompany)
        .then(function (res) {
          res.should.have.status(201);
        })
    });
  });

  describe('PUT endpoint', function () {
    it('should update fields you send over', function () {
      const updateData = {
        description: faker.lorem.sentences(),
        notes: faker.lorem.sentences()
      }
      return Company
        .findOne()
        .then(company => {
          updateData.id = company.id;

          return chai.request(app)
            .put(`/${company._id}`)
            .set('authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Company.findById(updateData.id);
        })
        .then(company => {
          company.description.should.equal(updateData.description);
          company.notes.should.equal(updateData.notes)
        })
      })
  });

  describe('DELETE endpoint', function () {
      it('should delete a company by id', function () {
      let company;
      return Company
        .findOne()
        .then(_company => {
          company = _company;
          return chai.request(app)
            .delete(`/${company._id}`)
            .set('authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(204);
          return Company.findById(company._id);
        })
        .then(_company => {
          should.not.exist(_company);
        });
    });
  });
});
