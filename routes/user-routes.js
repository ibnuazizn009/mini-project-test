`use strict`

const express = require('express');
const userController = require('../controller/user-controller');
const middlewares = require('../middleware');
const router = express.Router();

const {addUser, loginUser, getAllUser, getUserbyID, updateUserByID, userDelete} = userController;

router.post('/user', middlewares.register.validateRegister, addUser);
router.post('/login', loginUser);
router.get('/user', middlewares.jwt.verifyToken, getAllUser);
router.get('/user/:id', middlewares.jwt.verifyToken, getUserbyID);
router.patch('/user/:id', middlewares.jwt.verifyToken, updateUserByID);
router.delete('/user/:id', middlewares.jwt.verifyToken, userDelete);
module.exports = {
    routes: router
}