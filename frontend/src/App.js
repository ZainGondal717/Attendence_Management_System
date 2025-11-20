import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

// Import pages
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Validation from './pages/Validation';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>🔗 Blockchain Attendance Management System</h1>
          <p>Multi-layered Hierarchical Blockchain for Student Attendance Tracking</p>
          <div className="nav-links">
            <NavLink to="/" className="nav-link">Dashboard</NavLink>
            <NavLink to="/departments" className="nav-link">Departments</NavLink>
            <NavLink to="/classes" className="nav-link">Classes</NavLink>
            <NavLink to="/students" className="nav-link">Students</NavLink>
            <NavLink to="/attendance" className="nav-link">Attendance</NavLink>
            <NavLink to="/validation" className="nav-link">Validation</NavLink>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/validation" element={<Validation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
