const asyncHandler = require('express-async-handler')
const Park = require('../models/parkModel')

//desc POST Add product
//@route /api/parks
//@access private
const addPark = asyncHandler(
    async (req, res) => {
        const newPark = await Park.create(req.body)
        res.status(201).json(newPark)
    }
)

//desc GET get all available park
//@route /api/parks
//@access public
const getAvailableParks = asyncHandler(
    async (req, res) => {
        const allParks = await Park.find({})
        res.status(201).json(allParks)
    }
)

module.exports = {
    addPark,
    getAvailableParks
}