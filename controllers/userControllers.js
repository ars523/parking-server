const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

//@des Register new user
//@route /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, phone, photoURL } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone) {
        res.status(400)
        throw new Error('Please include all fields')
    }
    //Check password matched or not
    if (password !== confirmPassword) {
        res.status(400)
        throw new Error('Password not matched')
    }
    //Find if user already exist
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        name,
        email,
        phone,
        photoURL: photoURL || '',
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: getToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new error('Invalid user data');
    }
})



//@desc Signin a user
//@routes POST api/users/signin
//@access Public
const signinUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && await (bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: getToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid crediantials')
    }
})

function getToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
    signinUser,
    registerUser,
}