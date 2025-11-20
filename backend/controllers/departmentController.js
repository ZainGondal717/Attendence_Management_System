const blockchainService = require('../services/blockchainService');

/**
 * Department Controller
 * Handles all department-related HTTP requests
 */

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    
    const department = blockchainService.createDepartment({ name });
    res.status(201).json({ 
      success: true, 
      message: 'Department created successfully',
      data: department 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = blockchainService.getAllDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = blockchainService.getDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update department (adds new block)
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInfo = req.body;
    
    const result = blockchainService.updateDepartment(id, updatedInfo);
    res.json({ 
      success: true, 
      message: 'Department updated successfully (new block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete department (adds deletion block)
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = blockchainService.deleteDepartment(id);
    res.json({ 
      success: true, 
      message: 'Department deleted successfully (deletion block added)',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search departments
exports.searchDepartments = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = blockchainService.searchDepartments(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
