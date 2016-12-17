'use strict';

const jwt = require('../utils/jwt');
const log = require('../utils/logger');

function jwtHasExpired(credentials) {
  return false;
}

function verifyHasAccess(required, credentials) {
  return true;
}

function isProtected(req) {
  if (req.isProtected === false) {
    return false;
  } else {
    return true;
  }
}

function guard(level) {
  return function(req, res, next) {
  	console.log(req.headers['x-access-token'])
    let credentials = jwt.unbuild(req.headers['x-access-token']);
    console.log(credentials);
    // No access jwt was provided
    if (credentials === null) {
      res.status(401).send('Access denied');
      return;
    }

    if (jwtHasExpired(credentials)) {
      res.status(401).send('jwt expired');
      return;
    }

    if (verifyHasAccess(req.userType, credentials.userType) === true) {
      req.userId = credentials.iss;
      req.authInfo = credentials.authInfo;
      req.userType = credentials.userType;
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: 'Not authorized.',
      });
      return;
    }
  }

}

guard.set = function(auth, details) {
  console.log('trying', auth);
  return function(req, res, next) {
    console.log('setting protection');
    req.isProtected = auth;
    next();
  }
}

module.exports = guard;
