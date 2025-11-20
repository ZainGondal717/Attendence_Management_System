/**
 * API Test Examples
 * Use these examples to test the blockchain system
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test examples
async function testAPI() {
  console.log('🧪 Testing Blockchain API...\n');

  try {
    // 1. Get all departments
    console.log('1️⃣ Getting departments...');
    const depts = await axios.get(`${BASE_URL}/departments`);
    console.log(`   Found ${depts.data.data.length} departments`);
    const deptId = depts.data.data[0]?.departmentId;

    // 2. Create a new class
    if (deptId) {
      console.log('\n2️⃣ Creating a new class...');
      const newClass = await axios.post(`${BASE_URL}/classes`, {
        name: 'TEST-CLASS-001',
        departmentId: deptId
      });
      console.log(`   Created class: ${newClass.data.data.className}`);
      const classId = newClass.data.data.classId;

      // 3. Create a student
      console.log('\n3️⃣ Creating a student...');
      const newStudent = await axios.post(`${BASE_URL}/students`, {
        name: 'Test Student',
        rollNumber: 'TEST-2025-001',
        classId: classId,
        departmentId: deptId
      });
      console.log(`   Created student: ${newStudent.data.data.studentName}`);
      const studentId = newStudent.data.data.studentId;

      // 4. Mark attendance
      console.log('\n4️⃣ Marking attendance...');
      const attendance = await axios.post(`${BASE_URL}/attendance/mark`, {
        studentId: studentId,
        status: 'Present',
        date: new Date().toISOString().split('T')[0]
      });
      console.log(`   Attendance marked: ${attendance.data.data.status}`);

      // 5. Get student attendance history
      console.log('\n5️⃣ Getting attendance history...');
      const history = await axios.get(`${BASE_URL}/attendance/student/${studentId}`);
      console.log(`   Found ${history.data.data.attendance.length} attendance records`);

      // 6. Validate blockchain
      console.log('\n6️⃣ Validating blockchain...');
      const validation = await axios.get(`${BASE_URL}/validate/all`);
      console.log(`   Blockchain valid: ${validation.data.data.valid ? '✅ YES' : '❌ NO'}`);
      console.log(`   Departments: ${validation.data.data.departments.filter(d => d.valid).length}/${validation.data.data.departments.length}`);
      console.log(`   Classes: ${validation.data.data.classes.filter(c => c.valid).length}/${validation.data.data.classes.length}`);
      console.log(`   Students: ${validation.data.data.students.filter(s => s.valid).length}/${validation.data.data.students.length}`);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run tests
testAPI();
