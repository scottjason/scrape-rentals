/**
 * Main Config
 */

'use strict';

var env = {};
var path = require('path');

if (process.env.NODE_ENV !== 'production') {
  env = require('../../env.json');
}

module.exports = {
  server: {
    port: process.env.PORT || 3000
  },
  root: path.normalize(__dirname + '../../../'),
  sessionOpts: {
    saveUninitialized: true,
    resave: true,
    secret: process.env.SESSION_SECRET || env.SESSION_SECRET,
    cookie: {
      maxAge: new Date(Date.now() + 1209600000),
      expires: new Date(Date.now() + 1209600000)
    }
  }
};