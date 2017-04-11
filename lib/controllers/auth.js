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
const authService = require('../services/auth');
const usersService = require('../services/users');

const rejectWithStatus = errorHandling.rejectWithStatus;

authRouter.post('/login', (req, res) => {
  validateRequest(req, {
      'email': { in : 'body', notEmpty: true, isEmail: true },
      'password': { in : 'body', notEmpty: true }
    })
    .then(() => authService.getByEmail(req.body.email))
    .then(response => {
      if (!response) return rejectWithStatus(404, 'email not found');
      return password.compare(req.body.password, response.password);
    })
    .then(response => {
      if (response !== true) {
        return rejectWithStatus(403, 'invalid password');
      }
      return authService.getByEmail(req.body.email);
    })
    .then(response => {
      return res.status(201).json({
        jwt: jwt.build(response),
        profile: response
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

  authService.getById(credentials.userId)
    .then(response => {
      if (!response) {
        return res.status(404).send('That user does not exist anymore');
      }
      if (response.active !== true) {
        return res.status(403).send('User is not active');
      }
      return usersService.getById(credentials.userId);
    })
    .then(response => {
      let newToken = jwt.build(response);
      return res.status(200).json({ jwt: newToken, profile: response });
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
    .then(result => {
      let params = result.dataValues;
      params.path = `/auth/resetpassword?secrethash=${params.secretHash}`;
      return mail('forgot-password', params)
    })
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
        return rejectWithStatus(401, 'secretHash expired');
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
    .then(() => mail('password-reset', dbUser.dataValues))
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
      'type': req.body.type,
      'active': true
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
    .then(user => mail('signup', user.dataValues))
    .catch(errorHandling.catchAndRespond(req, res));

})

module.exports = authRouter;
