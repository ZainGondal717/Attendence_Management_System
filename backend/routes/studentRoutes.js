const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student routes
router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/search', studentController.searchStudents);
router.get('/class/:classId', studentController.getStudentsByClass);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
