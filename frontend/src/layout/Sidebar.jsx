import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav className="sidebar">
      <Link to="/">🏠 Home</Link>
      <Link to="/dashboard">📊 Dashboard</Link>
      <Link to="/cases">📁 All Cases</Link>
      <Link to="/add-case">➕ Add Case</Link>
    </nav>
  );
}
export default Sidebar;
