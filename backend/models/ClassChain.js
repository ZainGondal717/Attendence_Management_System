const Block = require('./Block');
const { v4: uuidv4 } = require('uuid');

/**
 * ClassChain - Layer 2 Blockchain
 * Child chain of Department Blockchain
 * Genesis block uses parent department's latest hash as prev_hash
 */
class ClassChain {
  constructor(classInfo, parentDepartmentChain) {
    this.classId = classInfo.id || uuidv4();
    this.className = classInfo.name;
    this.departmentId = classInfo.departmentId;
    this.parentDepartmentChain = parentDepartmentChain;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  /**
   * Create genesis block for class
   * CRITICAL: prev_hash = latest hash from parent department chain
   */
  createGenesisBlock() {
    const parentHash = this.parentDepartmentChain.getLatestBlock().hash;
    
    const genesisTransaction = {
      type: 'CLASS_CREATION',
      classId: this.classId,
      className: this.className,
      departmentId: this.departmentId,
      parentDepartmentHash: parentHash,
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
   * Add a new block to the class chain
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
   * Update class (adds new block)
   */
  updateClass(updatedInfo) {
    const updateTransaction = {
      type: 'CLASS_UPDATE',
      classId: this.classId,
      departmentId: this.departmentId,
      updatedFields: updatedInfo,
      timestamp: Date.now()
    };
    return this.addBlock(updateTransaction);
  }

  /**
   * Delete class (adds deletion block)
   */
  deleteClass() {
    const deleteTransaction = {
      type: 'CLASS_DELETION',
      classId: this.classId,
      departmentId: this.departmentId,
      status: 'deleted',
      timestamp: Date.now()
    };
    return this.addBlock(deleteTransaction);
  }

  /**
   * Get current class state
   */
  getCurrentState() {
    for (let i = this.chain.length - 1; i >= 0; i--) {
      const block = this.chain[i];
      if (block.transactions.status === 'deleted') {
        return { status: 'deleted', classId: this.classId };
      }
      if (block.transactions.type === 'CLASS_UPDATE') {
        return {
          status: 'active',
          classId: this.classId,
          departmentId: this.departmentId,
          ...block.transactions.updatedFields
        };
      }
      if (block.transactions.type === 'CLASS_CREATION') {
        return {
          status: 'active',
          classId: this.classId,
          className: block.transactions.className,
          departmentId: this.departmentId
        };
      }
    }
  }

  /**
   * Validate class chain
   * Must check: chain integrity + parent department link
   */
  isChainValid() {
    // Check genesis block links to parent department
    const genesisBlock = this.chain[0];
    const parentLatestHash = this.parentDepartmentChain.getLatestBlock().hash;
    
    if (genesisBlock.prev_hash !== genesisBlock.transactions.parentDepartmentHash) {
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
   * Check if parent department chain has been tampered
   * If parent is invalid, this chain is also invalid
   */
  isParentValid() {
    return this.parentDepartmentChain.isChainValid();
  }
}

module.exports = ClassChain;
