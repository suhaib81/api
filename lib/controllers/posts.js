'use strict';

const Promise = require('bluebird');
const logger = require('../utils/logger');
const models = require('../models');
const postRouter = require('express').Router();
const authGuard = require('../middlewares/auth-guard');

postRouter.route('', authGuard('user'))
    .get(authGuard('user'), (req, res) => {
        res.send({post: 'HELLO i\'m a post'});
    });

postRouter.route('/:questionId', authGuard('user'))
    .patch((req, res) => {
        res.status(204).send({message: 'ok'});
    })
    .delete((req, res) => {
        res.status(204).send({message: 'ok'});
    });

module.exports = questionRouter;
