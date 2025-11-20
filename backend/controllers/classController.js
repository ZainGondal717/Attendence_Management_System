const blockchainService = require('../services/blockchainService');

/**
 * Class Controller
 * Handles all class-related HTTP requests
 */

// Create new class
exports.createClass = async (req, res) => {
  try {
    const { name, departmentId } = req.body;
    
    if (!name || !departmentId) {
      return res.status(400).json({ error: 'Class name and department ID are required' });
    }
    
    const classData = blockchainService.createClass({ name, departmentId });
    res.status(201).json({ 
      success: true, 
      message: 'Class created successfully',
      data: classData 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = blockchainService.getAllClasses();
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = blockchainService.getClassById(id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    res.json({ success: true, data: classData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get classes by department
exports.getClassesByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const classes = blockchainService.getClassesByDepartment(deptId);
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInfo = req.body;
    
    const result = blockchainService.updateClass(id, updatedInfo);
    res.json({ 
      success: true, 
      message: 'Class updated successfully (new block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = blockchainService.deleteClass(id);
    res.json({ 
      success: true, 
      message: 'Class deleted successfully (deletion block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search classes
exports.searchClasses = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = blockchainService.searchClasses(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
