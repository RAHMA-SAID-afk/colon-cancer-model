const db = require('../config/db');

// Get all users
exports.getAllUsers = (callback) => {
  db.query('SELECT * FROM users', callback);
};

// Get user by ID
exports.getUserById = (id, callback) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], callback);
};

// Create user
exports.createUser = (data, callback) => {
  const { name, email, password_hash, role } = data;
  db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password_hash, role || 'doctor'],
    callback
  );
};

// Update user
exports.updateUser = (id, data, callback) => {
  const { name, email, password_hash, role } = data;
  db.query(
    'UPDATE users SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?',
    [name, email, password_hash, role, id],
    callback
  );
};

// Delete user
exports.deleteUser = (id, callback) => {
  db.query('DELETE FROM users WHERE id = ?', [id], callback);
};
