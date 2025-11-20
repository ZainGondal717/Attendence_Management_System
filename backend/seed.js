const blockchainService = require('./services/blockchainService');

/**
 * Seed script to populate the blockchain with sample data
 * Creates departments, classes, and students with sample attendance
 */

async function seedData() {
  console.log('🌱 Starting blockchain seed...\n');

  try {
    // Get existing departments (created by default)
    const departments = blockchainService.getAllDepartments();
    console.log(`✅ Found ${departments.length} departments`);

    const dept1 = departments[0]; // School of Computing
    const dept2 = departments[1]; // School of Software Engineering

    // Create 5 classes for each department
    console.log('\n📚 Creating classes...');
    const classesData = [];

    // Classes for School of Computing
    const computingClasses = [
      'CS-101-A', 'CS-102-B', 'CS-201-A', 'CS-202-B', 'CS-301-A'
    ];

    for (const className of computingClasses) {
      const cls = blockchainService.createClass({
        name: className,
        departmentId: dept1.departmentId
      });
      classesData.push(cls);
      console.log(`  ✓ Created class: ${className}`);
    }

    // Classes for School of Software Engineering
    const softwareClasses = [
      'SE-101-A', 'SE-102-B', 'SE-201-A', 'SE-202-B', 'SE-301-A'
    ];

    for (const className of softwareClasses) {
      const cls = blockchainService.createClass({
        name: className,
        departmentId: dept2.departmentId
      });
      classesData.push(cls);
      console.log(`  ✓ Created class: ${className}`);
    }

    // Create 35 students for each class
    console.log('\n👨‍🎓 Creating students...');
    const studentsData = [];

    for (const cls of classesData) {
      for (let i = 1; i <= 35; i++) {
        const paddedNumber = String(i).padStart(3, '0');
        const student = blockchainService.createStudent({
          name: `Student ${cls.className}-${paddedNumber}`,
          rollNumber: `${cls.className}-${paddedNumber}`,
          classId: cls.classId,
          departmentId: cls.departmentId
        });
        studentsData.push(student);
      }
      console.log(`  ✓ Created 35 students for ${cls.className}`);
    }

    // Mark some sample attendance
    console.log('\n📝 Marking sample attendance...');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Mark attendance for first 10 students
    const sampleStudents = studentsData.slice(0, 10);
    const statuses = ['Present', 'Absent', 'Leave'];

    for (const student of sampleStudents) {
      // Yesterday's attendance
      const status1 = statuses[Math.floor(Math.random() * statuses.length)];
      blockchainService.markAttendance(student.studentId, status1, yesterday);

      // Today's attendance
      const status2 = statuses[Math.floor(Math.random() * statuses.length)];
      blockchainService.markAttendance(student.studentId, status2, today);
    }
    console.log(`  ✓ Marked attendance for ${sampleStudents.length} students`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ BLOCKCHAIN SEEDED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   • Departments: ${departments.length}`);
    console.log(`   • Classes: ${classesData.length}`);
    console.log(`   • Students: ${studentsData.length}`);
    console.log(`   • Attendance Records: ${sampleStudents.length * 2}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
