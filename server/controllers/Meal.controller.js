const Meals = require('../models/Meal.model');
const Foods = require('../models/Food.model');





// Get All Meals
module.exports.getAllMeals = async (req, res) => {
  try {
    // Fetch all the meals associated with the authenticated user's ID
    const meals = await Meals.find({ userId: req.user.id });

    // If no meals were found, return a 404 error
    if (!meals) {
      return res.status(404).json({ msg: 'No meals found for this user.' });
    }

    // Return the meals
    res.status(200).json({ meals });
  } catch (error) {
    console.log("getAllMeals error: " + error)
    // If there was an error, return a 500 error
    res.status(500).json({ msg: error.message });
  }
}

// Get Single Meal
module.exports.getOneMeal = async (req, res) => {
  try {
    const meal = await Meals.findById(req.params.id).populate('foods');
    if (meal) {
      res.json({ meal: meal });
    } else {
      res.status(404).json({ msg: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};

// Create Meal
module.exports.createMeal = async (req, res) => {
  const { userId, foods, date, time } = req.body;
  try {
    const mealFoods = await Foods.find({ _id: { $in: foods.map(food => food.food) } });

    const totalNutrition = mealFoods.reduce((total, food) => {
      const quantity = foods.find(f => f.food.toString() === food._id.toString()).quantity;
      total.calories += food.calories * quantity;
      total.protein += food.protein * quantity;
      total.carbohydrates += food.carbohydrates * quantity;
      total.fat += food.fat * quantity;
      total.fiber += food.fiber * quantity;
      total.sugar += food.sugar * quantity;
      total.sodium += food.sodium * quantity;
      return total;
    }, {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });

    const newMeal = new Meals({
      userId,
      foods,
      date,
      time,
      ...totalNutrition
    });

    const savedMeal = await newMeal.save();
    res.status(200).json({ msg: 'Meal created successfully!', meal: savedMeal });
  } catch (error) {
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};


module.exports.updateMeal = async (req, res) => {
  try {
    const { foods, date, time } = req.body;
    const meal = await Meals.findById(req.params.id);

    if (meal) {
      // Validate that all food IDs exist
      const foodIds = foods.map(food => food.food);
      const foodDocuments = await Foods.find({ _id: { $in: foodIds } });
      if (foodDocuments.length !== foodIds.length) {
        return res.status(400).json({ msg: 'Some food IDs are invalid.' });
      }

      // Update meal properties
      meal.date = date ?? meal.date;
      meal.time = time ?? meal.time;
      meal.foods = foods ?? meal.foods;

      // Map food IDs to actual food documents
      const foodsMap = {};
      foodDocuments.forEach(foodDoc => {
        foodsMap[foodDoc._id] = foodDoc;
      });

      // Recalculate the total nutrition values
      const totalNutrition = meal.foods.reduce((total, foodItem) => {
        const food = foodsMap[foodItem.food];
        const quantity = foodItem.quantity;

        total.calories += food.calories * quantity;
        total.protein += food.protein * quantity;
        total.carbohydrates += food.carbohydrates * quantity;
        total.fat += food.fat * quantity;
        total.fiber += food.fiber * quantity;
        total.sugar += food.sugar * quantity;
        total.sodium += food.sodium * quantity;

        return total;
      }, {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      });

      // Update the meal's nutrition values
      meal.calories = totalNutrition.calories;
      meal.protein = totalNutrition.protein;
      meal.carbohydrates = totalNutrition.carbohydrates;
      meal.fat = totalNutrition.fat;
      meal.fiber = totalNutrition.fiber;
      meal.sugar = totalNutrition.sugar;
      meal.sodium = totalNutrition.sodium;

      const updatedMeal = await meal.save();
      res.json({ msg: 'Meal updated successfully', meal: updatedMeal });
    } else {
      res.status(404).json({ msg: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};


// Delete Meal
module.exports.deleteMeal = async (req, res) => {
  try {
    console.log("deleteMeal meal id: " + req.params.id)
    const meal = await Meals.findById(req.params.id);
    if (meal) {
      await Meals.deleteOne();
      res.json({ msg: 'Meal deleted successfully' });
    } else {
      res.status(404).json({ msg: 'Meal not found' });
    }
  } catch (error) {
    console.log("deleteMeal Error: " + error)
    res.status(500).json({ msg: 'Something went wrong', error: error });
  }
};
