const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Define the registration route
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/hospital-requestblood', usersController.requestBlood);
router.post('/hospital-patient', usersController.patientUsage);
router.get('/hospital-bloodusage', usersController.bloodUsage);
router.get('/hospital-getInventoryUpdates', usersController.getInventoryUpdate);
router.get('/hospital-getHospitalRequest', usersController.getHospitalRequest);
router.put('/bloodbank-updateStatus', usersController.updateStatus);

// Add more routes here as needed

module.exports = router;
