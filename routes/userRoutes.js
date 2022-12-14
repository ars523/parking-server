const express = require('express')
const userRouter = express.Router()
const {
    signinUser, 
    registerUser,
} = require('../controllers/userControllers')

userRouter.post('/register', registerUser)
userRouter.post('/signin', signinUser)

module.exports = userRouter