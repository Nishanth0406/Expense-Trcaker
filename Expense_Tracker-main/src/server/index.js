const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/expenses', require('./routes/expenses'));
// Add other routes as needed

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});