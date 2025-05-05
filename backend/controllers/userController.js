const User = require('../models/userModel');

// Get all users
exports.getUsers = (req, res) => {
  User.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  User.getUserById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
};

// Create user
exports.createUser = (req, res) => {
  User.createUser(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

// Update user
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  User.updateUser(userId, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated successfully' });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  User.deleteUser(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted successfully' });
  });
};
