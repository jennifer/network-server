'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();
const expect = chai.expect();

const { Website } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

/*
describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});
*/

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedWebsiteData() {
  console.info('seeding website data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      userId: faker.random.number(),
      url: faker.internet.url(),
      title: faker.lorem.sentence(),
      desktopImg: faker.image.abstract(),
      mobileImg: faker.image.abstract(),
      tags: faker.lorem.words(),
      created: faker.date.past()
    });
  }
  return Website.insertMany(seedData);
};

describe('website API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedWebsiteData();
  });
  afterEach(function () {
    return tearDownDb();
  });
  after(function () {
    return closeServer();
  });
 
  describe('GET endpoint', function () {
    
    // TypeError: res.body.should.have.length.of is not a function
    it('should return all existing websites', function () {
      let res;
      return chai.request(app)
        .get('/websites')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Website.count();
        })
        .then(count => {
          res.body.should.have.lengthOf(count);
        });
    });
    
    // AssertionError: expected { Object (created, _id, ...) } to contain keys '__v', '_id', 'userId', 'url', 'title', 'desktopImg', 'mobileImg', 'tags', and 'created'
    it('should return websites with right fields', function () {
      let resSite;
      return chai.request(app)
        .get('/websites')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function (site) {
            site.should.be.a('object');
            site.should.include.keys('userId', 'url', 'title', 'tags', 'created');
          });
          resSite = res.body[0];
          return Website.findById(resSite._id);
        })
        .then(site => {
          console.log("site", site);
          resSite.url.should.equal(site.url);
          resSite.title.should.equal(site.title);
          resSite.created.should.equal(site.created.toISOString());
        });
    });
  });


  // AssertionError: expected { Object (_id, userId, ...) } to contain keys 'userId', 'url', 'title', 'desktopImg', 'mobileImg', 'tags', and 'created'
  describe('POST endpoint', function () {
    it('should add a new website', function () {
      const newSite = {
        userId: faker.random.number(),
        url: faker.internet.url(),
        tags: faker.lorem.words(),
        created: faker.date.past()
      };
      return chai.request(app)
        .post('/websites')
        .send(newSite)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('userId', 'url', 'tags', 'created');
          res.body.url.should.equal(newSite.url);
          res.body._id.should.not.be.null;
          res.body.tags.should.equal(newSite.tags);
          return Website.findById(res.body._id);
        })
        .then(function (site) {
          site.userId.should.equal(String(newSite.userId));
        });
    });
  });

  describe('PUT endpoint', function () {
    it('should update fields you send over', function () {
      const updateData = {
        url: faker.internet.url(),
        title: faker.lorem.sentence(),
        desktopImg: faker.image.abstract(),
        mobileImg: faker.image.abstract(),
        tags: faker.lorem.words()
        }
      });
      return Website
        .findOne()
        .then(site => {
          updateData.id = site.id;

          return chai.request(app)
            .put(`/websites/${site.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return BlogPost.findById(updateData.id);
        })
        .then(site => {
          site.url.should.equal(updateData.url);
          site.title.should.equal(updateData.title);
          site.desktopImg.should.equal(updateData.desktopImg);
          site.mobileImg.should.equal(updateData.mobileImg);
          site.tags.should.equal(updateData.tags)
        })
  });

  describe('DELETE endpoint', function () {
      it('should delete a site by id', function () {
      let site;
      return Website
        .findOne()
        .then(_site => {
          site = _site;
          return chai.request(app).delete(`/websites/${site.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Website.findById(site.id);
        })
        .then(_site => {
          should.not.exist(_site);
        });
    });
  });
});