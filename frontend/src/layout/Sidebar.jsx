import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="sidebar">
      <Link to="/" className="nav-item">🏠 Home</Link>
      <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
      <Link to="/cases" className="nav-item">📁 All Cases</Link>
      <Link to="/add-case" className="nav-item">➕ Add Case</Link>
      <Link to="/reports" className="nav-item">📈 Reports</Link>
      <Link to="/settings" className="nav-item">⚙️ Settings</Link>
    </nav>
  );
}

export default Sidebar;
