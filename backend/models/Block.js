const crypto = require('crypto');

/**
 * Block class representing a single block in the blockchain
 * Contains all mandatory fields required for blockchain integrity
 */
class Block {
  constructor(index, transactions, prev_hash = '') {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.prev_hash = prev_hash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate SHA-256 hash of the block
   * Hash includes: timestamp, transactions, prev_hash, and nonce
   */
  calculateHash() {
    const data = 
      this.timestamp.toString() + 
      JSON.stringify(this.transactions) + 
      this.prev_hash + 
      this.nonce.toString();
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Proof of Work implementation
   * Mines block until hash starts with difficulty prefix (e.g., "0000")
   * @param {number} difficulty - Number of leading zeros required
   */
  mineBlock(difficulty = 4) {
    const target = '0'.repeat(difficulty);
    
    console.log(`Mining block ${this.index}...`);
    const startTime = Date.now();
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    
    const endTime = Date.now();
    console.log(`Block ${this.index} mined: ${this.hash} (Time: ${endTime - startTime}ms, Nonce: ${this.nonce})`);
  }

  /**
   * Validate block integrity
   * Checks if hash is correctly calculated
   */
  isValid() {
    return this.hash === this.calculateHash();
  }
}

module.exports = Block;
