const blockchainService = require('../services/blockchainService');

/**
 * Attendance Controller
 * Handles all attendance-related HTTP requests
 */

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body;
    
    if (!studentId || !status) {
      return res.status(400).json({ 
        error: 'Student ID and status are required' 
      });
    }
    
    if (!['Present', 'Absent', 'Leave'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be Present, Absent, or Leave' 
      });
    }
    
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const result = blockchainService.markAttendance(studentId, status, attendanceDate);
    
    res.status(201).json({ 
      success: true, 
      message: 'Attendance marked successfully',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark attendance for multiple students
exports.markBulkAttendance = async (req, res) => {
  try {
    const { attendance } = req.body; // array of {studentId, status, date}
    
    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ 
        error: 'Attendance array is required' 
      });
    }
    
    const results = [];
    const errors = [];
    
    for (const record of attendance) {
      try {
        const { studentId, status, date } = record;
        const attendanceDate = date || new Date().toISOString().split('T')[0];
        const result = blockchainService.markAttendance(studentId, status, attendanceDate);
        results.push(result);
      } catch (error) {
        errors.push({ studentId: record.studentId, error: error.message });
      }
    }
    
    res.json({ 
      success: true, 
      message: `Marked attendance for ${results.length} students`,
      data: { results, errors } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student attendance history
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = blockchainService.getStudentAttendance(studentId);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get class attendance
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;
    
    const attendance = blockchainService.getClassAttendance(classId, date);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get department attendance
exports.getDepartmentAttendance = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { date } = req.query;
    
    const attendance = blockchainService.getDepartmentAttendance(deptId, date);
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const attendance = blockchainService.getTodayAttendance();
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
