const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db'); // Ensure DB connection is established

// Import routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const imageRoutes = require('./routes/imageRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/predictions', predictionRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Colon Cancer Detection Backend is running 🚀');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
