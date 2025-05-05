const db = require('../config/db');

// Get all patients
exports.getAllPatients = (callback) => {
  db.query('SELECT * FROM patients', callback);
};

// Get a specific patient by ID
exports.getPatientById = (id, callback) => {
  db.query('SELECT * FROM patients WHERE id = ?', [id], callback);
};

// Create a new patient (including contact field)
exports.createPatient = (data, callback) => {
  const { full_name, age, gender, contact, created_by } = data;
  db.query(
    'INSERT INTO patients (full_name, age, gender, contact, created_by) VALUES (?, ?, ?, ?, ?)',
    [full_name, age, gender, contact, created_by],
    callback
  );
};

// Update an existing patient (including contact field)
exports.updatePatient = (id, data, callback) => {
  const { full_name, age, gender, contact } = data;
  db.query(
    'UPDATE patients SET full_name = ?, age = ?, gender = ?, contact = ? WHERE id = ?',
    [full_name, age, gender, contact, id],
    callback
  );
};

// Delete a patient
exports.deletePatient = (id, callback) => {
  db.query('DELETE FROM patients WHERE id = ?', [id], callback);
};
