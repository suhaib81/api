'use strict';

const Q = require('q');
const db = require('../db');
const express = require('express');
const router = express.Router();
const models = require('../models');
const password = require('../utils/password');
const jwt = require('../../jwt');
const log = require('../utils/logger');

router.post('/login', (req, res) => {
  var form = req.body;

  if (!form || !form.hasOwnProperty('email') || !form.hasOwnProperty('password')) {
    return res.status(422).json({
      id: 'oe.auth.001',
      message: 'Invalid login request: must contain email and password.'
    });
  }

  models.users.find(form.email)
    .then(response => {
      var dbUser = response;
      password.compare(form.password, dbUser.password)
        .then(result => {
          delete dbUser.password;
          var token = jwt.build(dbUser.email, dbUser.auth_group);
          return res.status(201).json({
            jwt: token,
            profile: dbUser
          });
        })
        .fail(error => res.status(500).json({
          id: 'auth005',
          message: 'Error comparing passwords',
          error: error
        }));
    })
    .fail(logErrorJson(req, res));

});

router.post('/logout', (req, res) => {
  console.log('login');
  return res.status(204).send();
});

router.post('/reset', (req, res) => {
  console.log('login');
  return res.status(204).send();
});

router.post('/forgot', (req, res) => {
  console.log('login');
  return res.status(204).send();
});

module.exports = router;
