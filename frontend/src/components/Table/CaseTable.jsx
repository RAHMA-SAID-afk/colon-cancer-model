import React, { useEffect, useState } from 'react';
import { fetchCases, deleteCase, updateCase } from '../../api';
import { FaEdit, FaTrash } from 'react-icons/fa';

function CaseTable() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState({ age: '', gender: '' });
  const [editingCase, setEditingCase] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    fetchCases()
      .then(res => setCases(res.data))
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      deleteCase(id)
        .then(() => {
          alert('Case deleted');
          loadCases();
        })
        .catch(() => alert('Delete failed'));
    }
  };

  const handleEditClick = (c) => {
    setEditingCase({ ...c });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCase(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateCase(editingCase.id, editingCase);
      alert('Case updated');
      setEditingCase(null);
      loadCases();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const filtered = cases.filter(c =>
    (!filter.age || c.age === parseInt(filter.age)) &&
    (!filter.gender || c.gender === filter.gender)
  );

  return (
    <div className="table-container">
      <div className="filters">
        <input
          placeholder="Filter by Age"
          value={filter.age}
          onChange={e => setFilter({ ...filter, age: e.target.value })}
        />
        <select
          value={filter.gender}
          onChange={e => setFilter({ ...filter, gender: e.target.value })}
        >
          <option value="">Filter by Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <table className="case-table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th> {/* Added Contact Column */}
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td>{c.full_name}</td>
              <td>{c.age}</td>
              <td>{c.gender}</td>
              <td>{c.contact}</td> {/* Show contact here */}
              <td>{new Date(c.created_at).toLocaleString()}</td>
              <td>
                <FaEdit
                  style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }}
                  onClick={() => handleEditClick(c)}
                />
                <FaTrash
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => handleDelete(c.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing */}
      {editingCase && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Case</h3>
            <input
              name="full_name"
              value={editingCase.full_name}
              onChange={handleEditChange}
              placeholder="Case Name"
            />
            <input
              name="age"
              type="number"
              value={editingCase.age}
              onChange={handleEditChange}
              placeholder="Age"
            />
            <select
              name="gender"
              value={editingCase.gender}
              onChange={handleEditChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              name="contact"
              value={editingCase.contact}
              onChange={handleEditChange}
              placeholder="Contact"
            />

            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSave}>💾 Save</button>
              <button onClick={() => setEditingCase(null)} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseTable;
