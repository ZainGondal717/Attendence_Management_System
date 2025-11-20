const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Class routes
router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/search', classController.searchClasses);
router.get('/department/:deptId', classController.getClassesByDepartment);
router.get('/:id', classController.getClassById);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;
