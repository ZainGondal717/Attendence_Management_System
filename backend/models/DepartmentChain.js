const Block = require('./Block');
const { v4: uuidv4 } = require('uuid');

/**
 * DepartmentChain - Layer 1 Blockchain
 * Independent blockchain for each department
 * Genesis block is tied only to the department
 */
class DepartmentChain {
  constructor(departmentInfo) {
    this.departmentId = departmentInfo.id || uuidv4();
    this.departmentName = departmentInfo.name;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  /**
   * Create genesis block for department
   * First block in the department chain
   */
  createGenesisBlock() {
    const genesisTransaction = {
      type: 'DEPARTMENT_CREATION',
      departmentId: this.departmentId,
      departmentName: this.departmentName,
      status: 'active',
      createdAt: Date.now()
    };

    const genesisBlock = new Block(0, genesisTransaction, '0');
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
   * Add a new block to the department chain
   * Used for updates or deletions (immutable)
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
   * Update department (adds new block, doesn't modify existing)
   */
  updateDepartment(updatedInfo) {
    const updateTransaction = {
      type: 'DEPARTMENT_UPDATE',
      departmentId: this.departmentId,
      updatedFields: updatedInfo,
      timestamp: Date.now()
    };
    return this.addBlock(updateTransaction);
  }

  /**
   * Delete department (adds deletion block, doesn't remove chain)
   */
  deleteDepartment() {
    const deleteTransaction = {
      type: 'DEPARTMENT_DELETION',
      departmentId: this.departmentId,
      status: 'deleted',
      timestamp: Date.now()
    };
    return this.addBlock(deleteTransaction);
  }

  /**
   * Get current department state (most recent non-deleted block)
   */
  getCurrentState() {
    // Iterate backwards to find latest state
    for (let i = this.chain.length - 1; i >= 0; i--) {
      const block = this.chain[i];
      if (block.transactions.status === 'deleted') {
        return { status: 'deleted', departmentId: this.departmentId };
      }
      if (block.transactions.type === 'DEPARTMENT_UPDATE') {
        return {
          status: 'active',
          departmentId: this.departmentId,
          ...block.transactions.updatedFields
        };
      }
      if (block.transactions.type === 'DEPARTMENT_CREATION') {
        return {
          status: 'active',
          departmentId: this.departmentId,
          departmentName: block.transactions.departmentName
        };
      }
    }
  }

  /**
   * Validate the entire department chain
   */
  isChainValid() {
    // Check genesis block
    if (this.chain[0].prev_hash !== '0') {
      return { valid: false, error: 'Genesis block prev_hash must be 0' };
    }

    // Validate each block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if hash is correctly calculated
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return { 
          valid: false, 
          error: `Block ${i} hash is invalid` 
        };
      }

      // Check if prev_hash matches previous block's hash
      if (currentBlock.prev_hash !== previousBlock.hash) {
        return { 
          valid: false, 
          error: `Block ${i} prev_hash doesn't match previous block` 
        };
      }

      // Check PoW (hash must start with required zeros)
      if (currentBlock.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
        return { 
          valid: false, 
          error: `Block ${i} doesn't satisfy PoW` 
        };
      }
    }

    return { valid: true };
  }
}

module.exports = DepartmentChain;
