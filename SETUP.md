# Blockchain-Based Attendance Management System
## Setup and Installation Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Backend Setup

### 1. Install Backend Dependencies
```powershell
cd e:\Blockchain3
npm install
```

### 2. Start the Backend Server
```powershell
npm start
```
The server will start on `http://localhost:5000`

### 3. (Optional) Seed Sample Data
To populate the blockchain with sample departments, classes, and students:
```powershell
node backend/seed.js
```

This will create:
- 2 Departments (School of Computing, School of Software Engineering)
- 10 Classes (5 per department)
- 350 Students (35 per class)
- Sample attendance records

## Frontend Setup

### 1. Navigate to Frontend Directory
```powershell
cd frontend
```

### 2. Install Frontend Dependencies
```powershell
npm install
```

### 3. Start the Frontend Development Server
```powershell
npm start
```
The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Running Both Backend and Frontend

### Option 1: Two Separate Terminals
**Terminal 1 (Backend):**
```powershell
cd e:\Blockchain3
npm start
```

**Terminal 2 (Frontend):**
```powershell
cd e:\Blockchain3\frontend
npm start
```

### Option 2: Concurrent Running (from root)
```powershell
cd e:\Blockchain3
npm run dev:full
```

## API Endpoints

### Departments
- `POST /api/departments` - Create department
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/departments/search?q=term` - Search departments

### Classes
- `POST /api/classes` - Create class
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `GET /api/classes/department/:deptId` - Get classes by department
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/search?q=term` - Search classes

### Students
- `POST /api/students` - Create student
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/class/:classId` - Get students by class
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/search?q=term` - Search students

### Attendance
- `POST /api/attendance/mark` - Mark single attendance
- `POST /api/attendance/mark-bulk` - Mark bulk attendance
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/class/:classId` - Get class attendance
- `GET /api/attendance/department/:deptId` - Get department attendance
- `GET /api/attendance/today` - Get today's attendance

### Validation
- `GET /api/validate/all` - Validate entire blockchain
- `GET /api/validate/department/:id` - Validate department chain
- `GET /api/validate/class/:id` - Validate class chain
- `GET /api/validate/student/:id` - Validate student chain

## Testing the API

### Using curl (PowerShell)

**Create a Department:**
```powershell
curl -Method POST -Uri "http://localhost:5000/api/departments" -ContentType "application/json" -Body '{"name":"School of Business"}'
```

**Get All Departments:**
```powershell
curl -Uri "http://localhost:5000/api/departments"
```

**Mark Attendance:**
```powershell
curl -Method POST -Uri "http://localhost:5000/api/attendance/mark" -ContentType "application/json" -Body '{"studentId":"STUDENT_ID_HERE","status":"Present","date":"2025-11-20"}'
```

**Validate Blockchain:**
```powershell
curl -Uri "http://localhost:5000/api/validate/all"
```

## Using the Frontend Interface

1. **Dashboard**: View system statistics and blockchain architecture info
2. **Departments**: Create, view, update, and delete departments; view blockchain
3. **Classes**: Manage classes under departments; view blockchain
4. **Students**: Manage students under classes; view blockchain with attendance
5. **Attendance**: Mark attendance for classes; view student attendance history
6. **Validation**: Validate entire blockchain system integrity

## Features

### Blockchain Features
- **SHA-256 Hashing**: All blocks use cryptographic hashing
- **Proof of Work**: Mining with difficulty 4 (hash must start with "0000")
- **Immutability**: No blocks can be modified or deleted
- **Hierarchical Linking**: 3-layer parent-child blockchain structure
- **Chain Validation**: Multi-level validation with cascade detection

### CRUD Operations
- **Create**: Add new departments, classes, students
- **Read**: View all entities, search, filter
- **Update**: Add update blocks (immutable)
- **Delete**: Add deletion blocks (immutable)

### Attendance System
- Mark individual or bulk attendance
- Three statuses: Present, Absent, Leave
- View by student, class, or department
- Complete blockchain history

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

**Backend:**
```powershell
$env:PORT=5001; npm start
```

**Frontend:**
Edit `frontend/src/services/api.js` and change the port.

### CORS Issues
If you encounter CORS errors, ensure the backend is running and the frontend is configured to connect to the correct backend URL.

### Mining Takes Too Long
The default difficulty is 4 (hash must start with "0000"). To reduce difficulty, edit:
- `backend/models/DepartmentChain.js` - line 11: `this.difficulty = 4;`
- `backend/models/ClassChain.js` - line 11: `this.difficulty = 4;`
- `backend/models/StudentChain.js` - line 13: `this.difficulty = 4;`

Change to `this.difficulty = 3;` or `2;` for faster mining (less secure).

## Project Structure
```
Blockchain3/
├── backend/
│   ├── models/          # Blockchain models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── seed.js          # Data seeding script
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── pages/       # React pages
│       ├── services/    # API service
│       ├── App.js       # Main app component
│       └── index.js     # Entry point
├── package.json         # Backend dependencies
└── README.md            # Documentation
```

## Assignment Requirements Checklist

✅ Node.js Backend (Express.js)
✅ React Frontend
✅ Custom-built blockchain (no external libraries)
✅ Three hierarchical blockchain layers
✅ Department Blockchain (Layer 1)
✅ Class Blockchain (Layer 2) - linked to departments
✅ Student Blockchain (Layer 3) - linked to classes
✅ SHA-256 hashing
✅ Proof of Work (mining with nonce)
✅ Full CRUD for departments, classes, students
✅ Immutable operations (no block deletion/modification)
✅ Update/Delete adds new blocks instead
✅ Attendance system (Present/Absent/Leave)
✅ Attendance stored as blockchain blocks
✅ Multi-level validation
✅ Cascade validation (tamper detection)
✅ Search functionality
✅ Blockchain visualization
✅ Default data (2 departments, classes, students)

## Support

For issues or questions:
1. Check the console logs (browser and terminal)
2. Verify all dependencies are installed
3. Ensure both backend and frontend are running
4. Check API endpoint responses using curl or Postman
