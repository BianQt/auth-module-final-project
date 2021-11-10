'use strict';

const express = require('express');
const { Task } = require('../models/index');
const taskRouter = express.Router();

const bearerAuth = require('../middleware/bearer.auth.js');
const permissions = require('../middleware/acl.auth');

taskRouter.get('/task',bearerAuth, permissions('delete'), getTask);
taskRouter.get('/task/:id',bearerAuth, permissions('read'), getOneTask);
taskRouter.post('/task', bearerAuth, permissions('create'), createTask);
taskRouter.put('/task/:id', bearerAuth, permissions('update'), updateTask);
taskRouter.delete('/task/:id', bearerAuth, permissions('delete'), deleteTask);


async function getTask(req, res) {
    const allTasks = await Task.read();
    res.status(200).json(allTasks);
}

async function getOneTask(req, res) {
    const id = parseInt(req.params.id);
    const oneTask = await Task.read(id);
    res.status(200).json(oneTask);
}

async function createTask(req, res) {
    const obj = req.body;
    let newTask = await Task.create(obj);
    res.status(201).json(newTask);
}

async function updateTask(req, res) {
    const id = parseInt(req.params.id);
    const obj = req.body;
    let updatedTask = await Task.update(id,obj);
    res.status(201).json(updatedTask);
}

async function deleteTask(req, res) {
    const id = parseInt(req.params.id);
    const deletedTask = await Task.delete(id);
    res.status(204).json(deletedTask);
}


module.exports = taskRouter;