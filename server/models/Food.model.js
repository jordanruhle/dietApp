const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required.'],
            minLength: [2, 'Name must be at least {MINLENGTH} characters.']
        },
        measurement: [
            {
                type: {
                    type: String,
                    required: [true, 'Measurement type is required.']
                },
                amount: {
                    type: Number,
                    required: [true, 'Measurement amount is required.'],
                    min: [0, 'Measurement amount must be 0 or greater.']
                }
            }
        ],
        servingSize: {
            type: Number,
            required: [true, 'Serving size is required.'],
            min: [0, 'Serving size must be 0 or greater.']
        },
        calories: {
            type: Number,
            required: [true, 'Calories are required.'],
            min: [0, 'Calories must be 0 or greater.']
        },
        protein: {
            type: Number,
            required: [true, 'Protein is required.'],
            min: [0, 'Protein must be 0 or greater.']
        },
        carbohydrates: {
            type: Number,
            required: [true, 'Carbohydrates are required.'],
            min: [0, 'Carbohydrates must be 0 or greater.']
        },
        fat: {
            type: Number,
            required: [true, 'Fat is required.'],
            min: [0, 'Fat must be 0 or greater.']
        },
        fiber: {
            type: Number,
            required: [true, 'Fiber is required.'],
            min: [0, 'Fiber must be 0 or greater.']
        },
        sugar: {
            type: Number,
            required: [true, 'Sugar is required.'],
            min: [0, 'Sugar must be 0 or greater.']
        },
        sodium: {
            type: Number,
            required: [true, 'Sodium is required.'],
            min: [0, 'Sodium must be 0 or greater.']
        },
        apiId: {
            type: String,
            // required: [true, 'API ID is required.']
        }
    },
    { timestamps: true });


const Foods = mongoose.model('Foods', FoodSchema);

module.exports = Foods;