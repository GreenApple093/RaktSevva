const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Define the registration route
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/hospital-requestblood', usersController.requestBlood);

// Add more routes here as needed

module.exports = router;
