const blockchainService = require('../services/blockchainService');

/**
 * Validation Controller
 * Handles blockchain validation requests
 */

// Validate entire blockchain system
exports.validateAll = async (req, res) => {
  try {
    console.log('Validating entire blockchain system...');
    const results = blockchainService.validateAll();
    
    res.json({ 
      success: true, 
      message: results.valid ? 'All blockchains are valid' : 'Validation failed',
      data: results 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate department chain
exports.validateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = blockchainService.validateDepartment(id);
    
    res.json({ 
      success: true, 
      message: result.valid ? 'Department chain is valid' : 'Department chain is invalid',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate class chain
exports.validateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const result = blockchainService.validateClass(id);
    
    res.json({ 
      success: true, 
      message: result.valid ? 'Class chain is valid' : 'Class chain is invalid',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate student chain
exports.validateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = blockchainService.validateStudent(id);
    
    res.json({ 
      success: true, 
      message: result.valid ? 'Student chain is valid' : 'Student chain is invalid',
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
