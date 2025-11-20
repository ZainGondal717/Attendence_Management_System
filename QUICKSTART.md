# Quick Start Guide

## Installation Steps

### 1. Install Backend Dependencies
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Start Backend Server
```bash
npm start
```
Server will run on http://localhost:5000

### 4. Start Frontend (New Terminal)
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

### 5. (Optional) Seed Sample Data
After starting the backend, open a new terminal and run:
```bash
npm run seed
```

This creates:
- 2 Departments
- 10 Classes (5 per department)
- 350 Students (35 per class)
- Sample attendance records

## System Overview

### Three-Layer Blockchain Architecture

**Layer 1: Department Blockchain**
- Independent chains for each department
- Genesis block tied to department creation

**Layer 2: Class Blockchain**
- Child chains linked to department blockchain
- Genesis block references parent department's latest hash

**Layer 3: Student Blockchain**
- Child chains linked to class blockchain
- Genesis block references parent class's latest hash
- Attendance records append to student's personal chain

### Key Features

✅ **Immutable Records**: No blocks can be modified or deleted
✅ **SHA-256 Hashing**: Cryptographic security
✅ **Proof of Work**: Mining with difficulty 4
✅ **Hierarchical Validation**: Tampering detection cascades through all layers
✅ **Full CRUD**: Create, Read, Update, Delete with blockchain integrity
✅ **Attendance Tracking**: Present, Absent, Leave status

## Usage

### Web Interface (http://localhost:3000)

1. **Dashboard**: View system statistics
2. **Departments**: Manage departments, view blockchain
3. **Classes**: Manage classes under departments
4. **Students**: Manage students under classes
5. **Attendance**: Mark and view attendance records
6. **Validation**: Verify blockchain integrity

### API Endpoints (http://localhost:5000/api)

- `/departments` - Department management
- `/classes` - Class management
- `/students` - Student management
- `/attendance` - Attendance operations
- `/validate` - Blockchain validation

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Blockchain**: Custom implementation (SHA-256, PoW)
- **Storage**: In-memory (can be extended)

## Need Help?

See SETUP.md for detailed documentation and troubleshooting.
