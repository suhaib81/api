'use strict';

const jwt = require('jsonwebtoken');
const log = require('./logger');

const timeValid = 60 * 60; // Amount of days login remains valid
const jwtSecret = process.env.JWT_SECRET;

function getExpirationDate() {
  let date = new Date();
  date.setDate(date.getDate() + timeValid);
  return date.getTime();
}

module.exports = {
  build(profile) {
    return jwt.sign({
      issuer: 'openembassy',
      userId: profile.userId,
      userType: profile.type,
      exp: getExpirationDate(),
    }, jwtSecret);
  },
  unbuild(token) {
    var decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      return null;
    }
    return decoded;
  }
};
