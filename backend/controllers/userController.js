const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/authentication'); // JWT generation
const User = require('../models/userModel');

// Get all users (admin only)
exports.getUsers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  User.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get user by ID (admin or the user itself)
exports.getUserById = (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  User.getUserById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result[0]);
  });
};

// Register a new user
exports.registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  // Ensure that the role is either 'doctor' or 'admin'
  if (role !== 'doctor' && role !== 'admin') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    // Create a new user in the database
    User.createUser({ name, email, password_hash: hashedPassword, role }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating user' });
      res.status(201).json({ message: 'User created successfully' });
    });
  });
};

// Login user and generate JWT token
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.getUserByEmail(email, (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Generate JWT token
      const token = generateToken(user); // Generate JWT token with user data
      res.json({ token });
    });
  });
};

// Update user (admin or the user itself)
exports.updateUser = (req, res) => {
  const userId = req.params.id;

  // Check if the user is admin or the user itself trying to update
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Update the user in the database
  User.updateUser(userId, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User updated successfully' });
  });
};

// Delete user (admin only)
exports.deleteUser = (req, res) => {
  // Only admins can delete users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const userId = req.params.id;

  // Delete the user from the database
  User.deleteUser(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted successfully' });
  });
};
