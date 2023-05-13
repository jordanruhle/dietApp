const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required.']
        },
        foods: [
            {
              food: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Foods',
                required: [true, 'Food reference is required.']
              },
              quantity: {
                type: Number,
                required: [true, 'Quantity is required.'],
                min: [1, 'Quantity must be 1 or greater.']
              }
            }
          ],
        date: {
            type: Date,
            required: [true, 'Date is required.']
        },
        time: {
            type: String,
            required: [true, 'Time is required.']
        },
        calories: {
            type: Number,
            default: 0
        },
        protein: {
            type: Number,
            default: 0
        },
        carbohydrates: {
            type: Number,
            default: 0
        },
        fat: {
            type: Number,
            default: 0
        },
        fiber: {
            type: Number,
            default: 0
        },
        sugar: {
            type: Number,
            default: 0
        },
        sodium: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true });

const Meals = mongoose.model('Meals', MealSchema);

module.exports = Meals;
