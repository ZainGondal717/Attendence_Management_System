const Block = require('./Block');
const { v4: uuidv4 } = require('uuid');

/**
 * StudentChain - Layer 3 Blockchain
 * Child chain of Class Blockchain
 * Genesis block uses parent class's latest hash as prev_hash
 * Attendance records append to this chain
 */
class StudentChain {
  constructor(studentInfo, parentClassChain) {
    this.studentId = studentInfo.id || uuidv4();
    this.studentName = studentInfo.name;
    this.rollNumber = studentInfo.rollNumber;
    this.classId = studentInfo.classId;
    this.departmentId = studentInfo.departmentId;
    this.parentClassChain = parentClassChain;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  /**
   * Create genesis block for student
   * CRITICAL: prev_hash = latest hash from parent class chain
   */
  createGenesisBlock() {
    const parentHash = this.parentClassChain.getLatestBlock().hash;
    
    const genesisTransaction = {
      type: 'STUDENT_CREATION',
      studentId: this.studentId,
      studentName: this.studentName,
      rollNumber: this.rollNumber,
      classId: this.classId,
      departmentId: this.departmentId,
      parentClassHash: parentHash,
      status: 'active',
      createdAt: Date.now()
    };

    const genesisBlock = new Block(0, genesisTransaction, parentHash);
    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  /**
   * Get the latest block in the chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new block to the student chain
   */
  addBlock(transaction) {
    const newBlock = new Block(
      this.chain.length,
      transaction,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    return newBlock;
  }

  /**
   * Update student (adds new block)
   */
  updateStudent(updatedInfo) {
    const updateTransaction = {
      type: 'STUDENT_UPDATE',
      studentId: this.studentId,
      classId: this.classId,
      departmentId: this.departmentId,
      updatedFields: updatedInfo,
      timestamp: Date.now()
    };
    return this.addBlock(updateTransaction);
  }

  /**
   * Delete student (adds deletion block)
   */
  deleteStudent() {
    const deleteTransaction = {
      type: 'STUDENT_DELETION',
      studentId: this.studentId,
      classId: this.classId,
      departmentId: this.departmentId,
      status: 'deleted',
      timestamp: Date.now()
    };
    return this.addBlock(deleteTransaction);
  }

  /**
   * Mark attendance - adds attendance block to student chain
   * @param {string} status - 'Present', 'Absent', or 'Leave'
   */
  markAttendance(status, date = new Date().toISOString().split('T')[0]) {
    const attendanceTransaction = {
      type: 'ATTENDANCE',
      studentId: this.studentId,
      studentName: this.studentName,
      rollNumber: this.rollNumber,
      classId: this.classId,
      departmentId: this.departmentId,
      status: status, // Present, Absent, Leave
      date: date,
      timestamp: Date.now()
    };
    return this.addBlock(attendanceTransaction);
  }

  /**
   * Get current student state
   */
  getCurrentState() {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      const block = this.chain[i];
      if (block.transactions.status === 'deleted') {
        return { status: 'deleted', studentId: this.studentId };
      }
      if (block.transactions.type === 'STUDENT_UPDATE') {
        return {
          status: 'active',
          studentId: this.studentId,
          classId: this.classId,
          departmentId: this.departmentId,
          ...block.transactions.updatedFields
        };
      }
      if (block.transactions.type === 'STUDENT_CREATION') {
        return {
          status: 'active',
          studentId: this.studentId,
          studentName: block.transactions.studentName,
          rollNumber: block.transactions.rollNumber,
          classId: this.classId,
          departmentId: this.departmentId
        };
      }
    }
  }

  /**
   * Get attendance history
   */
  getAttendanceHistory() {
    return this.chain
      .filter(block => block.transactions.type === 'ATTENDANCE')
      .map(block => ({
        index: block.index,
        date: block.transactions.date,
        status: block.transactions.status,
        timestamp: block.timestamp,
        hash: block.hash,
        prev_hash: block.prev_hash,
        nonce: block.nonce
      }));
  }

  /**
   * Validate student chain
   */
  isChainValid() {
    // Check genesis block links to parent class
    const genesisBlock = this.chain[0];
    
    if (genesisBlock.prev_hash !== genesisBlock.transactions.parentClassHash) {
      return { 
        valid: false, 
        error: 'Genesis block prev_hash does not match stored parent hash' 
      };
    }

    // Validate each block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return { valid: false, error: `Block ${i} hash is invalid` };
      }

      if (currentBlock.prev_hash !== previousBlock.hash) {
        return { 
          valid: false, 
          error: `Block ${i} prev_hash doesn't match previous block` 
        };
      }

      if (currentBlock.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
        return { valid: false, error: `Block ${i} doesn't satisfy PoW` };
      }
    }

    return { valid: true };
  }

  /**
   * Check if parent chains are valid
   */
  isParentValid() {
    const classValid = this.parentClassChain.isChainValid();
    if (!classValid.valid) return classValid;
    
    return this.parentClassChain.isParentValid();
  }
}

module.exports = StudentChain;
