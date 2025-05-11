const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get all users (admin only)
router.get('/', authMiddleware(['admin']), getUsers);

// Get user by ID (admin or the user itself)
router.get('/:id', authMiddleware(['admin', 'doctor']), getUserById);

// Update user (admin or the user itself)
router.put('/:id', authMiddleware(['admin', 'doctor']), updateUser);

// Delete user (admin only)
router.delete('/:id', authMiddleware(['admin']), deleteUser);

module.exports = router;
