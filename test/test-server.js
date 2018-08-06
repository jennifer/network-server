'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const should = chai.should();
const expect = chai.expect();

const { Company, Person } = require('../network/models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

chai.use(chaiHttp);

describe('network API resource', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedCompanyData();
  });
  beforeEach(function () {
    return seedPersonData();
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
        username,
        firstName,
        lastName
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

  function seedCompanyData() {
    console.info('seeding company data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        username:  faker.lorem.word(),
        name: faker.lorem.words(),
        url: faker.internet.url(),
        location: {
          city: faker.address.city(),
          state: faker.address.state(),
        },
        description: faker.lorem.sentences(),
        notes: faker.lorem.sentences()
      });
    }
    return Company.insertMany(seedData);
  };
   
  function seedPersonData() {
    console.info('seeding person data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        username: faker.lorem.word(),
        company_id: faker.lorem.word(),
        status: faker.lorem.words(),
        name: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        title: faker.lorem.words(),
        url: faker.internet.url(),
        contacts: {
          date: faker.date.past(),
          method: faker.lorem.words(),
        },
        notes: faker.lorem.sentences()
      });
    }
    return Person.insertMany(seedData);
  };

  describe('GET people endpoint', function () {
    it('should return all existing people', function () {
      let res;
      return chai.request(app)
        .get(`/people/${username}`)
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
    
    it('should return people with right fields', function () {
      let resPerson;
      return chai.request(app)
        .get(`/people/${username}`)
        .set('authorization', `Bearer ${token}`)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(person) {
            person.should.be.a('object');
            person.should.include.keys('username', 'company_id', 'status', 'nameString', 'title', 'url', 'contacts', 'notes');
          });
          resPerson = res.body[0];
          return Person.findById(resPerson._id);
        })
        .then(person => {
          console.log('person', person);
          resPerson.username.should.equal(person.username);
          resPerson.company_id.should.equal(person.company_id);
          resPerson.status.should.equal(person.status);
          resPerson.nameString.should.equal(person.nameString);
          resPerson.title.should.equal(person.title);
          resPerson.url.should.equal(person.url);
          resPerson.contacts.should.equal(person.contacts);
          resPerson.notes.should.equal(person.notes);
        });
    });
  });

  describe('POST endpoint', function () {
    it('should add a new person', function () {
      this.timeout(15000);
      const newPerson = {
        username: username,
        name: faker.lorem.words(),
        url: faker.internet.url(),
        location: {
          city: faker.address.city(),
          state: faker.address.state(),
        },
        description: faker.lorem.sentences(),
        notes: faker.lorem.sentences()
      };
      return chai.request(app)
        .post('/companies')
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
            .put(`/companies/${company._id}`)
            .set('authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Company.findById(updateData.id);
        })
        .then(company => {
          company.notes.should.equal(updateData.notes);
          company.tags[0].should.equal(updateData.tags)
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
            .delete(`/companies/${company._id}`)
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
