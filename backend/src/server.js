require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'East Ocean API is online' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`East Ocean API running on port ${PORT}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Connected' : 'Not connected'}`);
});

module.exports = app;
