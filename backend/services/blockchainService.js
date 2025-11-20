const DepartmentChain = require('../models/DepartmentChain');
const ClassChain = require('../models/ClassChain');
const StudentChain = require('../models/StudentChain');

/**
 * BlockchainService - Central service for managing all blockchain layers
 * Maintains in-memory storage of all chains
 */
class BlockchainService {
  constructor() {
    // Storage maps
    this.departmentChains = new Map(); // departmentId -> DepartmentChain
    this.classChains = new Map();       // classId -> ClassChain
    this.studentChains = new Map();     // studentId -> StudentChain
    
    // Index maps for quick lookups
    this.classesByDepartment = new Map(); // departmentId -> [classIds]
    this.studentsByClass = new Map();      // classId -> [studentIds]
    
    // Initialize with default departments
    this.initializeDefaultData();
  }

  /**
   * Initialize system with default departments as specified
   */
  initializeDefaultData() {
    console.log('Initializing blockchain system with default data...');
    
    // Create two departments
    const dept1 = this.createDepartment({ name: 'School of Computing' });
    const dept2 = this.createDepartment({ name: 'School of Software Engineering' });
    
    console.log(`Created departments: ${dept1.departmentId}, ${dept2.departmentId}`);
  }

  // ==================== DEPARTMENT OPERATIONS ====================

  /**
   * Create a new department with its blockchain
   */
  createDepartment(departmentInfo) {
    const departmentChain = new DepartmentChain(departmentInfo);
    this.departmentChains.set(departmentChain.departmentId, departmentChain);
    this.classesByDepartment.set(departmentChain.departmentId, []);
    
    return {
      departmentId: departmentChain.departmentId,
      departmentName: departmentChain.departmentName,
      genesisBlock: departmentChain.getLatestBlock()
    };
  }

  /**
   * Get all departments
   */
  getAllDepartments() {
    const departments = [];
    this.departmentChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted') {
        departments.push({
          departmentId: id,
          ...state,
          blockCount: chain.chain.length
        });
      }
    });
    return departments;
  }

  /**
   * Get department by ID
   */
  getDepartmentById(departmentId) {
    const chain = this.departmentChains.get(departmentId);
    if (!chain) return null;
    
    const state = chain.getCurrentState();
    return {
      departmentId,
      ...state,
      blockCount: chain.chain.length,
      chain: chain.chain
    };
  }

  /**
   * Update department (adds new block to chain)
   */
  updateDepartment(departmentId, updatedInfo) {
    const chain = this.departmentChains.get(departmentId);
    if (!chain) throw new Error('Department not found');
    
    const block = chain.updateDepartment(updatedInfo);
    return { success: true, block, state: chain.getCurrentState() };
  }

  /**
   * Delete department (adds deletion block)
   */
  deleteDepartment(departmentId) {
    const chain = this.departmentChains.get(departmentId);
    if (!chain) throw new Error('Department not found');
    
    const block = chain.deleteDepartment();
    return { success: true, block, status: 'deleted' };
  }

  /**
   * Search departments by name
   */
  searchDepartments(searchTerm) {
    const results = [];
    this.departmentChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted' && 
          state.departmentName.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ departmentId: id, ...state });
      }
    });
    return results;
  }

  // ==================== CLASS OPERATIONS ====================

  /**
   * Create a new class under a department
   */
  createClass(classInfo) {
    const { departmentId, name } = classInfo;
    
    const departmentChain = this.departmentChains.get(departmentId);
    if (!departmentChain) throw new Error('Department not found');
    
    const classChain = new ClassChain(
      { name, departmentId },
      departmentChain
    );
    
    this.classChains.set(classChain.classId, classChain);
    
    // Update index
    const classes = this.classesByDepartment.get(departmentId) || [];
    classes.push(classChain.classId);
    this.classesByDepartment.set(departmentId, classes);
    
    // Initialize student list for this class
    this.studentsByClass.set(classChain.classId, []);
    
    return {
      classId: classChain.classId,
      className: classChain.className,
      departmentId,
      genesisBlock: classChain.getLatestBlock()
    };
  }

  /**
   * Get all classes
   */
  getAllClasses() {
    const classes = [];
    this.classChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted') {
        classes.push({
          classId: id,
          ...state,
          blockCount: chain.chain.length
        });
      }
    });
    return classes;
  }

  /**
   * Get class by ID
   */
  getClassById(classId) {
    const chain = this.classChains.get(classId);
    if (!chain) return null;
    
    const state = chain.getCurrentState();
    return {
      classId,
      ...state,
      blockCount: chain.chain.length,
      chain: chain.chain
    };
  }

  /**
   * Get all classes in a department
   */
  getClassesByDepartment(departmentId) {
    const classIds = this.classesByDepartment.get(departmentId) || [];
    return classIds
      .map(id => this.getClassById(id))
      .filter(c => c && c.status !== 'deleted');
  }

  /**
   * Update class
   */
  updateClass(classId, updatedInfo) {
    const chain = this.classChains.get(classId);
    if (!chain) throw new Error('Class not found');
    
    const block = chain.updateClass(updatedInfo);
    return { success: true, block, state: chain.getCurrentState() };
  }

  /**
   * Delete class
   */
  deleteClass(classId) {
    const chain = this.classChains.get(classId);
    if (!chain) throw new Error('Class not found');
    
    const block = chain.deleteClass();
    return { success: true, block, status: 'deleted' };
  }

  /**
   * Search classes by name
   */
  searchClasses(searchTerm) {
    const results = [];
    this.classChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted' && 
          state.className.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ classId: id, ...state });
      }
    });
    return results;
  }

  // ==================== STUDENT OPERATIONS ====================

  /**
   * Create a new student under a class
   */
  createStudent(studentInfo) {
    const { classId, name, rollNumber, departmentId } = studentInfo;
    
    const classChain = this.classChains.get(classId);
    if (!classChain) throw new Error('Class not found');
    
    const studentChain = new StudentChain(
      { name, rollNumber, classId, departmentId },
      classChain
    );
    
    this.studentChains.set(studentChain.studentId, studentChain);
    
    // Update index
    const students = this.studentsByClass.get(classId) || [];
    students.push(studentChain.studentId);
    this.studentsByClass.set(classId, students);
    
    return {
      studentId: studentChain.studentId,
      studentName: studentChain.studentName,
      rollNumber: studentChain.rollNumber,
      classId,
      departmentId,
      genesisBlock: studentChain.getLatestBlock()
    };
  }

  /**
   * Get all students
   */
  getAllStudents() {
    const students = [];
    this.studentChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted') {
        students.push({
          studentId: id,
          ...state,
          blockCount: chain.chain.length
        });
      }
    });
    return students;
  }

  /**
   * Get student by ID
   */
  getStudentById(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) return null;
    
    const state = chain.getCurrentState();
    return {
      studentId,
      ...state,
      blockCount: chain.chain.length,
      chain: chain.chain
    };
  }

  /**
   * Get all students in a class
   */
  getStudentsByClass(classId) {
    const studentIds = this.studentsByClass.get(classId) || [];
    return studentIds
      .map(id => this.getStudentById(id))
      .filter(s => s && s.status !== 'deleted');
  }

  /**
   * Update student
   */
  updateStudent(studentId, updatedInfo) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const block = chain.updateStudent(updatedInfo);
    return { success: true, block, state: chain.getCurrentState() };
  }

  /**
   * Delete student
   */
  deleteStudent(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const block = chain.deleteStudent();
    return { success: true, block, status: 'deleted' };
  }

  /**
   * Search students by name or roll number
   */
  searchStudents(searchTerm) {
    const results = [];
    this.studentChains.forEach((chain, id) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted') {
        const nameMatch = state.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const rollMatch = state.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
        if (nameMatch || rollMatch) {
          results.push({ studentId: id, ...state });
        }
      }
    });
    return results;
  }

  // ==================== ATTENDANCE OPERATIONS ====================

  /**
   * Mark attendance for a student
   */
  markAttendance(studentId, status, date) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const studentState = chain.getCurrentState();
    if (studentState.status === 'deleted') {
      throw new Error('Cannot mark attendance for deleted student');
    }
    
    const block = chain.markAttendance(status, date);
    return { 
      success: true, 
      block,
      studentId,
      status,
      date
    };
  }

  /**
   * Get attendance history for a student
   */
  getStudentAttendance(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    return {
      studentId,
      studentInfo: chain.getCurrentState(),
      attendance: chain.getAttendanceHistory()
    };
  }

  /**
   * Get attendance for a class
   */
  getClassAttendance(classId, date) {
    const studentIds = this.studentsByClass.get(classId) || [];
    const attendance = [];
    
    studentIds.forEach(studentId => {
      const chain = this.studentChains.get(studentId);
      if (chain && chain.getCurrentState().status !== 'deleted') {
        const history = chain.getAttendanceHistory();
        const dateAttendance = date 
          ? history.filter(a => a.date === date)
          : history;
        
        attendance.push({
          studentId,
          studentInfo: chain.getCurrentState(),
          attendance: dateAttendance
        });
      }
    });
    
    return attendance;
  }

  /**
   * Get attendance for a department
   */
  getDepartmentAttendance(departmentId, date) {
    const classIds = this.classesByDepartment.get(departmentId) || [];
    const attendance = [];
    
    classIds.forEach(classId => {
      const classAttendance = this.getClassAttendance(classId, date);
      attendance.push({
        classId,
        classInfo: this.getClassById(classId),
        students: classAttendance
      });
    });
    
    return attendance;
  }

  /**
   * Get today's attendance across all students
   */
  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const attendance = [];
    
    this.studentChains.forEach((chain, studentId) => {
      const state = chain.getCurrentState();
      if (state.status !== 'deleted') {
        const history = chain.getAttendanceHistory();
        const todayRecord = history.filter(a => a.date === today);
        
        if (todayRecord.length > 0) {
          attendance.push({
            studentId,
            studentInfo: state,
            attendance: todayRecord
          });
        }
      }
    });
    
    return attendance;
  }

  // ==================== VALIDATION OPERATIONS ====================

  /**
   * Validate entire blockchain system (all three layers)
   */
  validateAll() {
    const results = {
      valid: true,
      departments: [],
      classes: [],
      students: [],
      errors: []
    };

    // Validate all department chains
    this.departmentChains.forEach((chain, id) => {
      const validation = chain.isChainValid();
      results.departments.push({
        departmentId: id,
        valid: validation.valid,
        error: validation.error
      });
      if (!validation.valid) {
        results.valid = false;
        results.errors.push(`Department ${id}: ${validation.error}`);
      }
    });

    // Validate all class chains
    this.classChains.forEach((chain, id) => {
      const validation = chain.isChainValid();
      const parentValidation = chain.isParentValid();
      
      results.classes.push({
        classId: id,
        valid: validation.valid && parentValidation.valid,
        error: validation.error || parentValidation.error
      });
      
      if (!validation.valid || !parentValidation.valid) {
        results.valid = false;
        results.errors.push(`Class ${id}: ${validation.error || parentValidation.error}`);
      }
    });

    // Validate all student chains
    this.studentChains.forEach((chain, id) => {
      const validation = chain.isChainValid();
      const parentValidation = chain.isParentValid();
      
      results.students.push({
        studentId: id,
        valid: validation.valid && parentValidation.valid,
        error: validation.error || parentValidation.error
      });
      
      if (!validation.valid || !parentValidation.valid) {
        results.valid = false;
        results.errors.push(`Student ${id}: ${validation.error || parentValidation.error}`);
      }
    });

    return results;
  }

  /**
   * Validate specific department chain
   */
  validateDepartment(departmentId) {
    const chain = this.departmentChains.get(departmentId);
    if (!chain) throw new Error('Department not found');
    
    return chain.isChainValid();
  }

  /**
   * Validate specific class chain
   */
  validateClass(classId) {
    const chain = this.classChains.get(classId);
    if (!chain) throw new Error('Class not found');
    
    const validation = chain.isChainValid();
    const parentValidation = chain.isParentValid();
    
    return {
      valid: validation.valid && parentValidation.valid,
      classValidation: validation,
      parentValidation: parentValidation
    };
  }

  /**
   * Validate specific student chain
   */
  validateStudent(studentId) {
    const chain = this.studentChains.get(studentId);
    if (!chain) throw new Error('Student not found');
    
    const validation = chain.isChainValid();
    const parentValidation = chain.isParentValid();
    
    return {
      valid: validation.valid && parentValidation.valid,
      studentValidation: validation,
      parentValidation: parentValidation
    };
  }
}

// Export singleton instance
module.exports = new BlockchainService();
