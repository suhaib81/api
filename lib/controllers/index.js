'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function(req,res) {
	res.send('something');
});

router.use('/v1/questions', require('./questions'));
router.use('/v1/auth', require('./auth'));

module.exports = function(app) {
  app.use(router);
};
