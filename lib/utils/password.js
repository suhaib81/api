'use strict';

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const saltRounds = 12;

module.exports = {
  compare(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (error, response) => {
        if (error) {
          reject(new Error('error comparing passwords'));
        } else {
          resolve(response);
        }
      });
    });
  },
  hash(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (error, response) => {
        if (error) {
          reject(new Error('error hashing password'));
        } else {
          resolve(response);
        }
      });
    });
  }
}
