'use strict';

const Promise = require('bluebird');
const pg = require('../db');

const service = module.exports = {
  getById,
  getByEmail
};

const users = {
  defaultFields: ['user_id', 'email', 'password', 'active'].join(', ')
};

function getById(userId) {
  return pg(`
    SELECT ${users.defaultFields}
    FROM users
    WHERE user_id = '${userId}';
  `)
    .then(response => response.rows[0]);
}

async function getByEmail(email) {
  return pg(`
    SELECT ${users.defaultFields}
    FROM users
    WHERE email = '${email}';
  `).then(response => response.rows[0]);
}
