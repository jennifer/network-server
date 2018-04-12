'use strict'; 

exports.DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost/site-bank';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/site-bank';
exports.PORT = process.env.PORT || 8080;