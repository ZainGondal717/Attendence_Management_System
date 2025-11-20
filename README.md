# Blockchain-Based Attendance Management System (BAMS)

## Overview
A multi-layered hierarchical blockchain system for managing student attendance across departments and classes.

## Architecture
The system implements a 3-layer blockchain hierarchy:

### Layer 1: Department Blockchain
- Independent blockchain for each department
- Genesis block tied to department creation

### Layer 2: Class Blockchain
- Child chain of department blockchain
- Genesis block uses parent department's latest hash

### Layer 3: Student Blockchain
- Child chain of class blockchain
- Genesis block uses parent class's latest hash
- Attendance records append to this chain

## Features
- Full CRUD operations for departments, classes, and students
- Immutable blockchain-based attendance tracking
- Proof of Work (PoW) mining mechanism
- SHA-256 hashing for block integrity
- Multi-level chain validation
- Hierarchical data integrity (tampering detection cascades)

## Installation

### Backend
```bash
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure
```
Blockchain3/
├── backend/
│   ├── models/
│   │   ├── Block.js
│   │   ├── DepartmentChain.js
│   │   ├── ClassChain.js
│   │   └── StudentChain.js
│   ├── services/
│   │   ├── blockchainService.js
│   │   ├── departmentService.js
│   │   ├── classService.js
│   │   ├── studentService.js
│   │   └── attendanceService.js
│   ├── controllers/
│   │   ├── departmentController.js
│   │   ├── classController.js
│   │   ├── studentController.js
│   │   └── attendanceController.js
│   ├── routes/
│   │   ├── departmentRoutes.js
│   │   ├── classRoutes.js
│   │   ├── studentRoutes.js
│   │   └── attendanceRoutes.js
│   ├── utils/
│   │   └── validator.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## API Endpoints

### Departments
- POST /api/departments - Create department
- GET /api/departments - Get all departments
- GET /api/departments/:id - Get department by ID
- PUT /api/departments/:id - Update department (adds block)
- DELETE /api/departments/:id - Delete department (adds block)

### Classes
- POST /api/classes - Create class
- GET /api/classes - Get all classes
- GET /api/classes/:id - Get class by ID
- GET /api/classes/department/:deptId - Get classes by department
- PUT /api/classes/:id - Update class
- DELETE /api/classes/:id - Delete class

### Students
- POST /api/students - Create student
- GET /api/students - Get all students
- GET /api/students/:id - Get student by ID
- GET /api/students/class/:classId - Get students by class
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

### Attendance
- POST /api/attendance/mark - Mark attendance
- GET /api/attendance/student/:studentId - Get student attendance history
- GET /api/attendance/class/:classId - Get class attendance
- GET /api/attendance/department/:deptId - Get department attendance
- GET /api/attendance/today - Get today's attendance

### Validation
- GET /api/validate/all - Validate entire blockchain system
- GET /api/validate/department/:id - Validate department chain
- GET /api/validate/class/:id - Validate class chain
- GET /api/validate/student/:id - Validate student chain

## Usage

1. Create departments (School of Computing, School of Software Engineering)
2. Add classes under departments
3. Add students to classes
4. Mark attendance (Present/Absent/Leave)
5. View blockchain history and validate integrity

## Block Structure
Each block contains:
- `index`: Block number
- `timestamp`: Creation time
- `transactions`: Data payload (attendance/metadata)
- `prev_hash`: Previous block hash (or parent chain hash)
- `nonce`: Proof of Work nonce
- `hash`: SHA-256 hash of block

## Blockchain Validation
The system validates:
1. Department chains are valid
2. Class chains are valid and linked to departments
3. Student chains are valid and linked to classes
4. Attendance records are valid
5. PoW is satisfied (hash starts with "0000")
6. Hash chains are unbroken

## Technologies
- Backend: Node.js, Express.js
- Frontend: React.js
- Hashing: SHA-256 (crypto module)
- Database: In-memory (can be extended to MongoDB/PostgreSQL)
