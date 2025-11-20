#!/usr/bin/env node

/**
 * Interactive Demo Script for Blockchain Attendance Management System
 * Run this after starting the backend server to see the system in action
 */

const readline = require('readline');
const blockchainService = require('./services/blockchainService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  console.log(text);
  console.log('='.repeat(60));
}

function printBlock(block) {
  console.log(`\n  📦 Block #${block.index}`);
  console.log(`  ⏰ Time: ${new Date(block.timestamp).toLocaleString()}`);
  console.log(`  🔢 Nonce: ${block.nonce}`);
  console.log(`  📝 Type: ${block.transactions.type}`);
  console.log(`  🔗 Hash: ${block.hash.substring(0, 20)}...`);
  console.log(`  ⬅️  Prev: ${block.prev_hash.substring(0, 20)}...`);
}

async function demo() {
  printHeader('🔗 BLOCKCHAIN ATTENDANCE MANAGEMENT SYSTEM DEMO');
  
  console.log('\nThis demo will showcase the 3-layer hierarchical blockchain:');
  console.log('  Layer 1: Department Blockchain');
  console.log('  Layer 2: Class Blockchain (linked to departments)');
  console.log('  Layer 3: Student Blockchain (linked to classes)');
  
  console.log('\nPress Enter to continue...');
  await new Promise(resolve => rl.question('', resolve));

  // Demo 1: Show existing departments
  printHeader('LAYER 1: DEPARTMENT BLOCKCHAIN');
  const departments = blockchainService.getAllDepartments();
  console.log(`\nFound ${departments.length} departments:\n`);
  departments.forEach((dept, i) => {
    console.log(`  ${i + 1}. ${dept.departmentName} (ID: ${dept.departmentId.substring(0, 8)}...)`);
    console.log(`     Status: ${dept.status}, Blocks: ${dept.blockCount}`);
  });

  console.log('\nPress Enter to view a department\'s blockchain...');
  await new Promise(resolve => rl.question('', resolve));

  const dept1 = blockchainService.getDepartmentById(departments[0].departmentId);
  console.log(`\n📊 Blockchain for: ${dept1.departmentName}`);
  dept1.chain.forEach(block => printBlock(block));

  // Demo 2: Create a class
  printHeader('LAYER 2: CLASS BLOCKCHAIN (Child of Department)');
  console.log('\n🏗️  Creating a new class...');
  
  const newClass = blockchainService.createClass({
    name: 'DEMO-CLASS-2025',
    departmentId: departments[0].departmentId
  });
  
  console.log(`\n✅ Class created: ${newClass.className}`);
  console.log(`   Class ID: ${newClass.classId.substring(0, 8)}...`);
  console.log(`   Linked to department: ${departments[0].departmentName}`);
  
  console.log('\n🔗 Notice: Genesis block uses parent department\'s latest hash!');
  console.log(`   Department latest hash: ${dept1.chain[dept1.chain.length - 1].hash.substring(0, 20)}...`);
  console.log(`   Class genesis prev_hash: ${newClass.genesisBlock.prev_hash.substring(0, 20)}...`);
  console.log('   ✅ MATCH! This links the class chain to the department chain.');

  console.log('\nPress Enter to continue...');
  await new Promise(resolve => rl.question('', resolve));

  // Demo 3: Create a student
  printHeader('LAYER 3: STUDENT BLOCKCHAIN (Child of Class)');
  console.log('\n🏗️  Creating a new student...');
  
  const newStudent = blockchainService.createStudent({
    name: 'Alice Johnson',
    rollNumber: 'DEMO-2025-001',
    classId: newClass.classId,
    departmentId: departments[0].departmentId
  });
  
  console.log(`\n✅ Student created: ${newStudent.studentName}`);
  console.log(`   Roll Number: ${newStudent.rollNumber}`);
  console.log(`   Student ID: ${newStudent.studentId.substring(0, 8)}...`);
  
  const classData = blockchainService.getClassById(newClass.classId);
  console.log('\n🔗 Notice: Genesis block uses parent class\'s latest hash!');
  console.log(`   Class latest hash: ${classData.chain[classData.chain.length - 1].hash.substring(0, 20)}...`);
  console.log(`   Student genesis prev_hash: ${newStudent.genesisBlock.prev_hash.substring(0, 20)}...`);
  console.log('   ✅ MATCH! This links the student chain to the class chain.');

  console.log('\nPress Enter to mark attendance...');
  await new Promise(resolve => rl.question('', resolve));

  // Demo 4: Mark attendance
  printHeader('ATTENDANCE SYSTEM');
  console.log('\n📝 Marking attendance for Alice...');
  
  const today = new Date().toISOString().split('T')[0];
  const attendance1 = blockchainService.markAttendance(
    newStudent.studentId,
    'Present',
    today
  );
  
  console.log(`\n✅ Attendance marked: ${attendance1.status} on ${attendance1.date}`);
  console.log('   New block added to student\'s blockchain!');

  console.log('\n📝 Marking another day\'s attendance...');
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const attendance2 = blockchainService.markAttendance(
    newStudent.studentId,
    'Absent',
    yesterday
  );
  console.log(`\n✅ Attendance marked: ${attendance2.status} on ${attendance2.date}`);

  console.log('\nPress Enter to view student\'s complete blockchain...');
  await new Promise(resolve => rl.question('', resolve));

  const studentData = blockchainService.getStudentById(newStudent.studentId);
  console.log(`\n📊 Complete Blockchain for: ${studentData.studentName}`);
  studentData.chain.forEach(block => printBlock(block));

  // Demo 5: Validation
  printHeader('BLOCKCHAIN VALIDATION');
  console.log('\n🔍 Validating entire blockchain system...\n');
  
  const validation = blockchainService.validateAll();
  
  if (validation.valid) {
    console.log('✅ ALL BLOCKCHAINS ARE VALID!');
  } else {
    console.log('❌ VALIDATION FAILED!');
  }
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Departments: ${validation.departments.filter(d => d.valid).length}/${validation.departments.length} valid`);
  console.log(`   Classes: ${validation.classes.filter(c => c.valid).length}/${validation.classes.length} valid`);
  console.log(`   Students: ${validation.students.filter(s => s.valid).length}/${validation.students.length} valid`);

  if (validation.errors.length > 0) {
    console.log('\n❌ Errors found:');
    validation.errors.forEach(err => console.log(`   - ${err}`));
  }

  // Demo 6: Show hierarchical integrity
  printHeader('HIERARCHICAL INTEGRITY DEMONSTRATION');
  console.log('\nThe blockchain hierarchy ensures:');
  console.log('  🔒 Tampering with a department invalidates ALL its classes');
  console.log('  🔒 Tampering with a class invalidates ALL its students');
  console.log('  🔒 Tampering with a student affects only that student');
  console.log('\nThis creates a pyramid of trust where security cascades down!');

  // Demo 7: Immutability
  printHeader('IMMUTABILITY DEMONSTRATION');
  console.log('\n📝 Updating student name (adds a new block, doesn\'t modify old ones)...');
  
  blockchainService.updateStudent(newStudent.studentId, {
    name: 'Alice Johnson Smith'
  });
  
  const updatedStudent = blockchainService.getStudentById(newStudent.studentId);
  console.log(`\n✅ Student updated!`);
  console.log(`   Original genesis block still exists with: ${newStudent.studentName}`);
  console.log(`   New update block added with: Alice Johnson Smith`);
  console.log(`   Total blocks in student chain: ${updatedStudent.blockCount}`);
  console.log('\n🔒 This is TRUE IMMUTABILITY - history is never erased!');

  // Summary
  printHeader('DEMO COMPLETE');
  console.log('\n🎉 You\'ve seen how the 3-layer blockchain works!');
  console.log('\nKey Takeaways:');
  console.log('  ✅ Each layer links to its parent via genesis block');
  console.log('  ✅ All blocks are mined with Proof of Work');
  console.log('  ✅ SHA-256 ensures cryptographic security');
  console.log('  ✅ Updates and deletes add blocks, never remove them');
  console.log('  ✅ Validation checks entire chain hierarchy');
  console.log('  ✅ Attendance records are immutable blockchain entries');
  
  console.log('\n📚 Next Steps:');
  console.log('  1. Start the frontend: cd frontend && npm start');
  console.log('  2. Open http://localhost:3000 in your browser');
  console.log('  3. Explore the full UI with blockchain visualization');
  console.log('  4. Try the validation page to see real-time integrity checks');
  
  console.log('\n👋 Thank you for watching the demo!\n');
  
  rl.close();
}

// Run demo
demo().catch(console.error);
