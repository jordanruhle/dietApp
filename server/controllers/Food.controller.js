const Foods = require("../models/Food.model");
const axios = require("axios");

// Read All
module.exports.getAllFoods = async (req, res) => {
  try {
    const allFoods = await Foods.find({ userId: req.user.id });
    res.json({ foods: allFoods });
  } catch (error) {
    console.error("Get all food error: " + error);
    res.json({ msg: 'Something went wrong', error: error });
  }
};

// Find One
module.exports.findOneFood = async (req, res) => {
  try {
    const oneFood = await Foods.findOne({ _id: req.params.id, userId: req.user.id });
    res.json({ food: oneFood });
  } catch (error) {
    console.error("Find One food error: " + error);
    res.json({ msg: 'Something went wrong', error: error });
  }
};

// Create One
module.exports.createNewFood = async (req, res) => {
  const newFood = new Foods({
    ...req.body,
    userId: req.user.id
  });
  try {
    await newFood.save();
    res.status(201).json({ msg: 'Food created successfully', food: newFood });
  } catch (error) {
    console.error("Create food error: " + error);
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};

// Update One
module.exports.updateFood = async function updateFood(req, res) {
  const foodId = req.params.id;
  const updatedFoodData = req.body;

  try {
    const updatedFood = await Foods.findOneAndUpdate(
      { _id: foodId },
      { $set: updatedFoodData },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ msg: 'Food not found' });
    }

    res.status(200).json({ food: updatedFood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Something went wrong', error });
  }
}

// Delete One
module.exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Foods.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (deletedFood.deletedCount > 0) {
      res.json({ msg: 'Food deleted successfully', result: deletedFood });
    } else {
      res.status(404).json({ msg: 'Food not found', result: deletedFood });
    }
  } catch (error) {
    console.error("Delete food error: " + error);
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};

// Search Foods using API
module.exports.searchFoodsUsingAPI = async (req, res) => {
  try {
    const query = req.params.query;
    const response = await axios.get(`https://api.example.com/food_search?query=${query}`);
    res.json(response.data);
  } catch (error) {
    console.error("Search Foods API error: " + error);
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};
