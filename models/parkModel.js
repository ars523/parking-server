const mongoose = require('mongoose')

const parkSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        address: {
            type: String,
            required: [true, 'Please enter address of the park']
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        slots: [
            {
                vehicle: {
                    type: String,
                    required: [true, 'Please select a vehicle'],
                    enum: ['Byke', 'Car'],
                },
                bookingStatus: { type: Boolean, default: false },
                description: {
                    type: String,
                    required: [true, 'Please Enter a description'],
                },

            },
        ]
    },
    {
        timestamps: true,
    }
);

const Park = mongoose.model('Park', parkSchema);
module.exports = Park