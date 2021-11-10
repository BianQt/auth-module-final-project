'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models/index');
const basicAuth = require('../middleware/basic.auth.js')
const bearerAuth = require('../middleware/bearer.auth.js')
const acl = require('../middleware/acl.auth')

authRouter.post('/signup', async (req, res, next) => {
    try {
      let userRecord = await users.create(req.body);
      res.status(201).json(userRecord);
    } catch (e) {
      next(e.message)
    }
  });

authRouter.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).json(req.user);
});

authRouter.get('/users', bearerAuth, acl('delete'), async (req, res, next) => {
  const userRecords = await users.findAll({});
  res.status(200).json(userRecords);
});


module.exports = authRouter;