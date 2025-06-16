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

// User Profile Update Endpoint
app.put('/api/users/profile', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Update user in database
  pool.query(
    'UPDATE users SET firstName = ?, lastName = ? WHERE email = ?',
    [firstName, lastName, email],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error updating profile' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }

      res.json({ 
        message: 'Profile updated successfully',
        user: { firstName, lastName, email }
      });
    }
  );
});

// Add this new endpoint
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  
  pool.query(
    'SELECT firstName, lastName, email FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    }
  );
});

// Add these new endpoints after existing ones

// Create Workflow - Modified to include userId
app.post('/api/workflows', (req, res) => {
  const { title, objective, dueDate, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ error: 'Title and userId are required' });
  }

  pool.query(
    'INSERT INTO workflows (title, objective, dueDate, userId) VALUES (?, ?, ?, ?)',
    [title, objective, dueDate, userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error creating workflow' });
      }
      
      res.status(201).json({ 
        id: results.insertId,
        title,
        objective,
        dueDate,
        userId,
        columns: []
      });
    }
  );
});

// Get workflows - Modified to filter by userId
app.get('/api/workflows/:userId', (req, res) => {
  const { userId } = req.params;

  pool.query(
    `SELECT w.*, 
      COUNT(DISTINCT c.id) as columnCount,
      COUNT(DISTINCT t.id) as taskCount
    FROM workflows w
    LEFT JOIN columns c ON w.id = c.workflowId
    LEFT JOIN tasks t ON c.id = t.columnId
    WHERE w.userId = ?
    GROUP BY w.id
    ORDER BY w.createdAt DESC`,
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching workflows' });
      }
      res.json(results);
    }
  );
});

// Update workflow
app.put('/api/workflows/:id', (req, res) => {
  const { id } = req.params;
  const { title, objective, dueDate } = req.body;

  pool.query(
    'UPDATE workflows SET title = ?, objective = ?, dueDate = ? WHERE id = ?',
    [title, objective, dueDate, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error updating workflow' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      res.json({ message: 'Workflow updated successfully' });
    }
  );
});

// Delete workflow (will cascade delete columns and tasks)
app.delete('/api/workflows/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM workflows WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error deleting workflow' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Next step to display the information to the frontend