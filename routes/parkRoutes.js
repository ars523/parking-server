const express = require('express')
const parkRouter = express.Router()
const {
    addPark,
    getAvailableParks, 
} = require('../controllers/parkControllers')

parkRouter.post('/', addPark)
parkRouter.get('/', getAvailableParks)

module.exports = parkRouter