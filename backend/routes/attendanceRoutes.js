const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Attendance routes
router.post('/mark', attendanceController.markAttendance);
router.post('/mark-bulk', attendanceController.markBulkAttendance);
router.get('/student/:studentId', attendanceController.getStudentAttendance);
router.get('/class/:classId', attendanceController.getClassAttendance);
router.get('/department/:deptId', attendanceController.getDepartmentAttendance);
router.get('/today', attendanceController.getTodayAttendance);

module.exports = router;
