'use strict';

var Promise = require('bluebird');
const util = require('util');
const authRouter = require('express').Router();
const models = require('../models');
const password = require('../utils/password');
const jwt = require('../utils/jwt');
const log = require('../utils/logger');
const errorHandling = require('../utils/error-handling');
const validateRequest = require('../utils/validate-request');
const authGuard = require('../middlewares/auth-guard');
const crypto = require('crypto');
const mail = require('../utils/mail');

const rejectWithStatus = errorHandling.rejectWithStatus;

authRouter.post('/login', (req, res) => {
  let dbUser;

  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true },
      'password': { in : 'body', notEmpty: true }
    })
    .then(() => models.Users.findOne({ where: { email: req.body.email } }))
    .then(response => {
      if (!response) {
        return rejectWithStatus(404, 'email not found');
      }
      dbUser = response.dataValues;
      return password.compare(req.body.password, dbUser.password)
        .then(response => {
          if (response === true) {
            dbUser.password = undefined;
            return res.status(201).json({
              jwt: jwt.build(dbUser),
              profile: dbUser
            });
          } else {
            return rejectWithStatus(403, 'invalid password');
          }
        });
    })
    .catch(errorHandling.catchAndRespond(req, res));
});

authRouter.delete('/logout', (req, res) => {

  return res.status(204).send();
});

authRouter.post('/exchangetoken', (req, res) => {
  if (!req.headers['x-access-token']) {
    return res.status(403).send('Missing jwt in headers');
  }

  let credentials = jwt.unbuild(req.headers['x-access-token']);
  if (credentials === null) {
    return res.status(403).send('Access denied, invalid token');
  }

  models.Users.findOne({
      where: { userId: credentials.userId },
      attributes: { exclude: ['password'] }
    })
    .then(response => {
      let user = response.dataValues;
      if (!user) {
        return res.status(404).send('That user does not exist anymore');
      }
      if (user.active !== true) {
        return res.status(403).send('User is not active');
      }

      let newToken = jwt.build(user);
      user.password = undefined;
      return res.status(200).json({ jwt: newToken, profile: user });
    })
    .catch(errorHandling.catchAndRespond(req, res));
});

authRouter.post('/forgot', (req, res) => {
  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true }
    })
    .then(() => models.Users.findOne({
      where: { email: req.body.email },
      attributes: { exclude: ['password'] }
    }))
    .then(user => {
      if (!user) {
        return rejectWithStatus(404, 'user with that email not found');
      } else {
        return user.update({
          secretHash: crypto.randomBytes(20).toString('hex'),
          secretHashIssuedAt: new Date()
        });
      }
    })
    .then(user => mail.send('forgotPassword', user.dataValues))
    .then(() => res.status(201).json({ message: 'Email sent' }))
    .catch(errorHandling.catchAndRespond(req, res));
});

authRouter.post('/confirmsecrethash', (req, res) => {
  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true },
      'secretHash': { in : 'body', notEmpty: true }
    })
    .then(() => models.Users.findOne({
      where: { email: req.body.email, secretHash: req.body.secretHash },
      attributes: { exclude: ['password'] }
    }))
    .then(user => {
      if (!user) {
        return rejectWithStatus(404, 'Invalid combination of email and secretHash');
      }
      let expiresAt = new Date(user.dataValues.secretHashIssuedAt);
      expiresAt.setDate(expiresAt.getDate() + 1);
      if (expiresAt < new Date()) {
        return rejectWithStatus(404, 'secretHash expired');
      }
      return res.status(200).json({ message: 'secret hash valid' });
    })
    .catch(errorHandling.catchAndRespond(req, res));
});

authRouter.post('/resetpassword', (req, res) => {
  let dbUser;
  let hashedPassword;

  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true },
      'password': { in : 'body', notEmpty: true },
      'secretHash': { in : 'body', notEmpty: true }
    })
    .then(() => models.Users.findOne({
      where: { email: req.body.email, secretHash: req.body.secretHash },
      attributes: { exclude: ['password'] }
    }))
    .then(user => {
      if (!user) {
        return rejectWithStatus(404, 'Invalid combination of email and secretHash');
      }

      dbUser = user;

      let expiresAt = new Date(user.dataValues.secretHashIssuedAt);
      expiresAt.setDate(expiresAt.getDate() + 1);

      if (expiresAt < new Date()) {
        return rejectWithStatus(400, 'secretHash expired');
      }

      return password.hash(req.body.password);
    })
    .then(hashedPassword => dbUser.update({ password: hashedPassword }))
    .then(() => mail.send('passwordReset', dbUser.dataValues))
    .then(() => dbUser.update({ secretHash: null, secredHashIssuedAt: null }))
    .then(response => {
      return res.status(200).json({
        jwt: jwt.build(dbUser.dataValues),
        profile: dbUser.dataValues
      })
    })
    .catch(errorHandling.catchAndRespond(req, res));
});

authRouter.post('/signup', (req, res) => {
  console.log('SDFDSF');
  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true },
      'password': { in : 'body', notEmpty: true },
      'firstName': { in : 'body', notEmpty: true },
      'lastName': { in : 'body', notEmpty: true }
    })
    .then(() => models.Users.findOne({ where: { email: req.body.email } }))
    .then(response => {
      if (response) {
        return rejectWithStatus(409, 'that email address is already taken');
      }
      return password.hash(req.body.password);
    })
    .then(hashedPassword => models.Users.create({
      'email': req.body.email,
      'password': hashedPassword,
      'lastName': req.body.lastName,
      'firstName': req.body.firstName,
      'type': req.body.type
    }))
    .then(user => {
      user.dataValues.password = undefined;
      try {
        res.status(201).json({
          jwt: jwt.build(user.dataValues),
          profile: user.dataValues
        });
      } catch (e) {
        return Promise.reject(e);
      }
      return Promise.resolve(user);
    })
    .then(user => mail.send('signup', user.dataValues))
    .catch(errorHandling.catchAndRespond(req, res));

})

module.exports = authRouter;
