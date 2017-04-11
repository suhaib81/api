'use strict';

const Promise = require('bluebird');
const pg = require('../db');

const service = module.exports = {
  getById,
  getByEmail
};

async function getById(userId) {
  const response = await pg(`
    SELECT user_id, email, password, active
    FROM users
    WHERE user_id = '${userId}';
  `);
  return response.rows[0];
}

async function getByEmail(email) {
  const response = await pg(`
    SELECT user_id, email, password, active
    FROM users
    WHERE email = '${email}';
  `);
  return response.rows[0];
}
