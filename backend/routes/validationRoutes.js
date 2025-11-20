const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validationController');

// Validation routes
router.get('/all', validationController.validateAll);
router.get('/department/:id', validationController.validateDepartment);
router.get('/class/:id', validationController.validateClass);
router.get('/student/:id', validationController.validateStudent);

module.exports = router;
