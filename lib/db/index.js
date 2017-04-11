'use strict';

const Promise = require('bluebird');
const Pool = require('pg-pool');
const logger = require('../utils/logger');

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: false,
  max: 20,
  min: 4,
  idleTimeoutMillis: 1000,
  Promise: Promise
});

function logSqlError(query, error) {
  const pos = parseInt(error.position);
  const sql = query.substring(0, pos) + query.substring(pos, pos + 2).bgRed + query.substring(pos + 2);
  logger.pgError(`PGError ${error.code} at position ${error.position} in SQL: ${sql}`);
};

async function query(query, params) {
  if (!query) throw new Error({ status: 500, message: 'missing required parameter - query' });

  const client = await pool.connect();

  try {
    return await client.query(query, params);
  } catch (error) {
    logSqlError(query, error);
    throw new Error('db error');
  } finally {
    client.release();
  }

}


module.exports = query;
