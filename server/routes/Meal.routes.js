const MealController = require("../controllers/Meal.controller");
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.get('/api/meals/find/:id', authenticate, MealController.getOneMeal);
  app.get('/api/meals', authenticate, MealController.getAllMeals);
  app.post('/api/meals', authenticate, MealController.createMeal);
  app.put('/api/meals/update/:id', authenticate, MealController.updateMeal);
  app.delete('/api/meals/delete/:id', authenticate, MealController.deleteMeal);
};
