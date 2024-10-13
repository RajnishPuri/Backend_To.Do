const express = require('express');
const Router = express.Router();
require('dotenv').config();

const authmiddleware = require('../middlewares/authmidleware');
const { signup, login, verification, logout } = require('../controller/User.auth');
const { createTodo, getTodos, updateTodo, starredTodo, deleteTodo } = require('../controller/todos');


Router.post('/signup', signup);
Router.post('/verify-user', verification);
Router.post('/login', login);
Router.post('/logout', logout);

Router.post('/todos', authmiddleware, createTodo);
Router.get('/todos', authmiddleware, getTodos);

Router.put('/todos/:id', authmiddleware, updateTodo);
Router.put('/startodos/:id', authmiddleware, starredTodo);

Router.delete('/todos/:id', authmiddleware, deleteTodo);

Router.get('/check-auth', authmiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token is valid.",
        user: req.user,
    });
});

module.exports = Router;


