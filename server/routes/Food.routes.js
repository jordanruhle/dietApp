const FoodController = require("../controllers/Food.controller");
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.get('/api/foods/find/:id', authenticate, FoodController.findOneFood);
  app.get('/api/foods', authenticate, FoodController.getAllFoods);
  app.post('/api/foods', authenticate, FoodController.createNewFood);
  app.put('/api/foods/update/:id', authenticate, FoodController.updateFood);
  app.delete('/api/foods/delete/:id', authenticate, FoodController.deleteFood);
  app.get('/api/foods/search/:query', authenticate, FoodController.searchFoodsUsingAPI);
};
