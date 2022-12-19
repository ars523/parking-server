const express = require('express')
const userRouter = express.Router()
const {
    signinUser, 
    registerUser,
} = require('../controllers/userControllers')

userRouter.post('/signup', registerUser)
userRouter.post('/signin', signinUser)

module.exports = userRouter