const express = require('express');
const Router = express.Router();
const {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    allTasks
} = require('../controllers/tasks');
const verifyToken = require('../verifyToken');

Router.post('/addtask', verifyToken, addTask);
Router.get('/gettask/:id', verifyToken, getTask);         
Router.put('/updatetask/:id', verifyToken, updateTask);   
Router.delete('/deletetask/:id', verifyToken, deleteTask);
Router.get('/getalltasks/:userId', verifyToken, allTasks);       

module.exports = Router;
