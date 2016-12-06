'use strict';

const Q 							= require('q');
const logger 					= require('../utils/logger');
const models 					= require('../models');
const express 				= require('express')
const router 					= express.Router()

router.get('',function(req,res) {
	res.send({question:'HELLO'});
})

module.exports = router;