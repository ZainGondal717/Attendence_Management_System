const blockchainService = require('../services/blockchainService');

/**
 * Student Controller
 * Handles all student-related HTTP requests
 */

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const { name, rollNumber, classId, departmentId } = req.body;
    
    if (!name || !rollNumber || !classId || !departmentId) {
      return res.status(400).json({ 
        error: 'Student name, roll number, class ID, and department ID are required' 
      });
    }
    
    const student = blockchainService.createStudent({ 
      name, 
      rollNumber, 
      classId, 
      departmentId 
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully',
      data: student 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = blockchainService.getAllStudents();
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = blockchainService.getStudentById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = blockchainService.getStudentsByClass(classId);
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInfo = req.body;
    
    const result = blockchainService.updateStudent(id, updatedInfo);
    res.json({ 
      success: true, 
      message: 'Student updated successfully (new block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = blockchainService.deleteStudent(id);
    res.json({ 
      success: true, 
      message: 'Student deleted successfully (deletion block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search students
exports.searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = blockchainService.searchStudents(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
