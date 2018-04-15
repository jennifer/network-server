'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const app = require('../server.js');

const should = chai.should();
const expect = chai.expect();

const { Website } = require('./models');
const { closeServer, runServer, app } = require('../server');
const { PORT, DATABASE_URL } = require('./config');

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
    userId: faker.random.number(),
    url: faker.internet.url(),
    title: faker.lorem.sentence(),
    desktopImg: faker.image.abstract(),
    mobileImg: faker.image.abstract(),
    tags: faker.lorem.words(),
    created: faker.date.past()
    };
  }
  // this will return a promise
  return Website.insertMany(seedData);
}

describe('website API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedWebsiteData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function () {

    it('should return all existing websites', function () {
      // strategy:
      //    1. get back all posts returned by by GET request to `/websites`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/websites')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.should.have.length.of.at.least(1);

          return Website.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          res.body.should.have.length.of(count);
        });
    });

    it('should return websites with right fields', function () {
      // Strategy: Get back all posts, and ensure they have expected keys
      let resPost;
      return chai.request(app)
        .get('/websites')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function (site) {
            site.should.be.a('object');
            site.should.include.keys('userId', 'url', 'title', 'desktopImg', 'mobileImg', 'tags', 'created');
          });
          resSite = res.body[0];
          return Website.findById(resSite.id);
        })
        .then(site => {
          resSite.url.should.equal(site.url);
          resSite.title.should.equal(site.title);
          resSite.created.should.equal(site.created);
        });
    });
  });

  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new website', function () {

      const newSite = {
        userId: faker.random.number(),
        url: faker.internet.url(),
        title: faker.lorem.sentence(),
        desktopImg: faker.image.abstract(),
        mobileImg: faker.image.abstract(),
        tags: faker.lorem.words(),
        created: faker.date.past()
      };

      return chai.request(app)
        .post('/websites')
        .send(newSite)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'userId', 'url', 'title', 'desktopImg', 'mobileImg', 'tags', 'created');
          res.body.url.should.equal(newSite.url);
          res.body.id.should.not.be.null;
          res.body.author.should.equal(
            `${newSite.title} ${newSite.title}`);
          res.body.tags.should.equal(newSite.tags);
          return Website.findById(res.body.id);
        })
        .then(function (post) {
          site.userId.should.equal(newSite.userId);
          site.title.should.equal(newSite.title);
          site.desktopImg.should.equal(newSite.desktopImg);
          site.created.should.equal(newSite.should);
        });
    });
  });

  describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        title: 'cats cats cats',
        content: 'dogs dogs dogs',
        author: {
          firstName: 'foo',
          lastName: 'bar'
        }
      };

      return BlogPost
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/posts/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return BlogPost.findById(updateData.id);
        })
        .then(post => {
          post.title.should.equal(updateData.title);
          post.content.should.equal(updateData.content);
          post.author.firstName.should.equal(updateData.author.firstName);
          post.author.lastName.should.equal(updateData.author.lastName);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a post by id', function () {

      let post;

      return BlogPost
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return BlogPost.findById(post.id);
        })
        .then(_post => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_post);
        });
    });
  });
});