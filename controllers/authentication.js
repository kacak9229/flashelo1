const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

exports.tokenForUser = function(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
