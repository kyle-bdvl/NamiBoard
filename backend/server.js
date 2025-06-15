// setting up the backend API 
const express = require('express');
const mysql = require('mysql2');
const config = require('./config');
const cors = require('cors');
const app = express();
const port = 5000;

// Create database connection pool
const pool = mysql.createPool(config.db);

// Verify database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Successfully connected to database.');
  connection.release();
});

// Middleware
app.use(express.json());
app.use(cors());

// Test route using database
app.get("/api", (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ users: results });
  });
});

// User Registration Endpoint
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert new user
  pool.query(
    'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password],
    (error, results) => {
      if (error) {
        // Check for duplicate email
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// User Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check user credentials
  pool.query(
    'SELECT firstName, lastName, email FROM users WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error during login' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ 
        message: 'Login successful',
        user: results[0]
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Next step to display the information to the frontend