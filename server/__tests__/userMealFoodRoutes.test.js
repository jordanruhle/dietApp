const request = require('supertest');
const { agent } = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Import your app
const Food = require('../models/Food.model');
const Meal = require('../models/Meal.model');

const jwtSecret = process.env.USER_LOGIN_REG_SECRET_KEY;

describe('User, Food and Meal Routes', () => {
  let userId, token, foodId, foodId2, mealId, mealId2;
  const testAgent = agent(app);

  // User registration
  it('POST /api/users', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      password: 'testpassword',
      confirmPassword: 'testpassword',
    };

    const res = await testAgent.post('/api/users').send(newUser);
    userId = res.body.user._id;
    expect(res.status).toEqual(200);
    expect(res.body.msg).toEqual('success!');
    expect(res.body.user).toHaveProperty('_id');
  });

  // User login
  it('POST /api/users/login', async () => {
    const credentials = {
      email: 'test.user@example.com',
      password: 'testpassword',
    };

    const res = await testAgent.post('/api/users/login').send(credentials);
    token = res.body.token;
    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('login succesful');
  });

  // Food creation
  it('POST /api/foods', async () => {
    const newFood = {
      userId,
      name: 'Apple',
      measurement: { type: 'number', amount: 1 },
      servingSize: 1,
      calories: 95,
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      sodium: 1.8,
    };

    const res = await testAgent.post('/api/foods').send(newFood);
    console.log("Create Food res.body: " + JSON.stringify(res.body));
    console.log("Created Food: ", res.body.food, " User ID: ", userId);
    foodId = res.body.food._id;
    expect(res.status).toEqual(201);
    expect(res.body.food).toHaveProperty('_id');
  });

  it('POST /api/foods', async () => {
    const newFood = {
      userId,
      name: 'Banana',
      measurement: { type: 'number', amount: 1 },
      servingSize: 1,
      calories: 110,
      protein: 1,
      carbohydrates: 28,
      fat: 0,
      fiber: 3,
      sugar: 15,
      sodium: 1,
    };

    const res = await testAgent.post('/api/foods').send(newFood);
    console.log("Created Food: ", res.body.food, " User ID: ", userId);
    foodId2 = res.body.food._id;
    expect(res.status).toEqual(201);
    expect(res.body.food).toHaveProperty('_id');
  });

  // Food update
  it('PUT /api/foods/update/:id', async () => {
    const updatedFood = {
      userId,
      name: 'Green Apple',
      measurement: { type: 'number', amount: 1 },
      servingSize: 1,
      calories: 95,
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      sodium: 1.8,
    };


    const res = await testAgent.put(`/api/foods/update/${foodId}`).send(updatedFood);
    console.log("Update Food res.body: " + JSON.stringify(res.body));
    console.log("Updated Food: ", res.body.food, " User ID: ", userId);
    expect(res.status).toEqual(200);
    expect(res.body.food).toHaveProperty('_id', foodId);
    expect(res.body.food.name).toEqual('Green Apple');
  });

  // GET All Foods
  it('GET /api/foods', async () => {
    const res = await testAgent
      .get('/api/foods')
      .set('Authorization', `Bearer ${token}`);
 
    console.log("Get all foods res.body: " + JSON.stringify(res.body));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.foods)).toBe(true);
    expect(res.body.foods.length).toBeGreaterThanOrEqual(2);

    // Check if the returned foods match the created foods
    const food1 = res.body.foods.find(food => food._id === foodId);
    const food2 = res.body.foods.find(food => food._id === foodId2);

    expect(food1.name).toEqual('Green Apple');
    expect(food2.name).toEqual('Banana');
  });

  // Meal creation
  it('POST /api/meals', async () => {
    const newMeal = {
      userId,
      foods: [
        {
          food: foodId,
          quantity: 1
        },
        {
          food: foodId2,
          quantity: 1
        }
      ],
      date: new Date(),
      time: '12:00'
    };

    const res = await testAgent
      .post('/api/meals')
      .set('Authorization', `Bearer ${token}`)
      .send(newMeal);
    console.log("Create Meal res.body: " + JSON.stringify(res.body));
    mealId = res.body.meal._id;
    expect(res.status).toEqual(200);
    expect(res.body.meal).toHaveProperty('_id');
  });

  // Meal update (add new food and remove existing food)
  it('PUT /api/meals/update/:id', async () => {
    const updatedMeal = {
      foods: [
        {
          food: foodId2,
          quantity: 2
        }
      ],
    };

    const res = await testAgent
      .put(`/api/meals/update/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMeal);

    console.log("Update Meal res.body: " + JSON.stringify(res.body));
    expect(res.status).toEqual(200);
    expect(res.body.meal).toHaveProperty('_id', mealId);
    expect(res.body.meal.foods.length).toEqual(1);
    expect(res.body.meal.foods[0].food.toString()).toEqual(foodId2.toString());
    expect(res.body.meal.foods[0].quantity).toEqual(2);
  });

  // Create another meal
  it('POST /api/meals', async () => {
    const newMeal = {
      userId,
      foods: [
        {
          food: foodId,
          quantity: 2
        }
      ],
      date: new Date(),
      time: '18:00'
    };

    const res = await testAgent
      .post('/api/meals')
      .set('Authorization', `Bearer ${token}`)
      .send(newMeal);
    console.log("Create Meal 2 res.body: " + JSON.stringify(res.body));
    mealId2 = res.body.meal._id;
    expect(res.status).toEqual(200);
    expect(res.body.meal).toHaveProperty('_id');
  });

  // Get all meals
  it('GET /api/meals', async () => {
    const res = await testAgent
      .get('/api/meals')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.meals)).toBe(true);
    expect(res.body.meals.length).toBeGreaterThanOrEqual(2);
  });

  // Delete meals
  it('DELETE /api/meals/delete/:id', async () => {
    const res = await testAgent
      .delete(`/api/meals/delete/${mealId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Meal deleted successfully');
  });

  it('DELETE /api/meals/delete/:id', async () => {
    const res = await testAgent
      .delete(`/api/meals/delete/${mealId2}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Meal deleted successfully');
  });

  // Delete foods
  it('DELETE /api/foods/delete/:id', async () => {
    const res = await testAgent.delete(`/api/foods/delete/${foodId}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Food deleted successfully');
  });

  it('DELETE /api/foods/delete/:id', async () => {
    const res = await testAgent.delete(`/api/foods/delete/${foodId2}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Food deleted successfully');
  });

  // User deletion
  it('DELETE /api/users/delete/:id', async () => {
    const res = await testAgent.delete(`/api/users/delete/${userId}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'User deleted successfully');
  });
});