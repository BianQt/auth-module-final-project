'use strict';

const express = require('express');
const authRouter = express.Router();


const { users } = require('../models/index');
const basicAuth = require('../middleware/basic.auth.js')
const bearerAuth = require('../middleware/bearer.auth.js')
const acl = require('../middleware/acl.auth')

authRouter.post('/signup',bearerAuth,acl('create'), async (req, res, next) => {
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

authRouter.get('/users/:id', bearerAuth, acl('delete'), async (req, res, next) => {
  const id = parseInt(req.params.id); 
  const userRecords = await users.findOne({where :{id}});
  res.status(200).json(userRecords);
});

authRouter.put('/users/:id', bearerAuth, acl('delete'), async (req, res, next) => {
  const id = parseInt(req.params.id); 
  const object = req.body;
  const userRecords = await users.findOne({where :{id}});
  let updatedUser = await userRecords.update(object);
  res.status(200).json(updatedUser);
});

authRouter.delete('/users/:id', bearerAuth, acl('delete'), async (req, res) => {
  const id = parseInt(req.params.id); 
  const userRecords = await users.destroy({where : {id:id}});

  res.status(200).json(userRecords);
});


module.exports = authRouter;