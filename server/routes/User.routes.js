const UserController = require("../controllers/User.controller")
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.get('/api/users/find/:id', UserController.findoneSingleUser);
  app.get('/api/users', UserController.getAllUsers);
  app.post('/api/users', UserController.createNewUser);
  app.post('/api/users/login', UserController.userLogin);
  app.post('/api/users/logout', UserController.userLogout);
  app.get('/api/users/authenticate', authenticate )
}