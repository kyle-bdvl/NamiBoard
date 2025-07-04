// setting up the backend API 
const express = require('express');
const mysql = require('mysql2');
const config = require('./config');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
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

// Get workflows for specific user
app.get('/api/workflows/:userId', (req, res) => {
  const { userId } = req.params;

  // Add console.log for debugging
  console.log('Fetching workflows for user:', userId);

  pool.query(
    `SELECT * FROM workflows WHERE userId = ?`,
    [userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error fetching workflows' });
      }
      console.log('Found workflows:', results);
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

// Create a new column for a workflow
app.post('/api/columns', (req, res) => {
  console.log('Received column data:', req.body);
  const { title, description, workflowId, color } = req.body;
  if (!title || !workflowId) {
    return res.status(400).json({ error: 'Title and workflowId are required' });
  }
  pool.query(
    'INSERT INTO columns (title, description, color, workflowId) VALUES (?, ?, ?, ?)',
    [title, description, color, workflowId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error creating column' });
      }
      res.status(201).json({
        id: results.insertId,
        title,
        description,
        color,
        workflowId
      });
    }
  );
});

// Get all columns for a workflow
app.get('/api/workflows/:workflowId/columns', (req, res) => {
  const { workflowId } = req.params;
  pool.query(
    'SELECT * FROM columns WHERE workflowId = ?',
    [workflowId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching columns' });
      }
      res.json(results);
    }
  );
});

// Get all workflows for a user, including columns
app.get('/api/user/:userId/workflows-with-columns', (req, res) => {
  const { userId } = req.params;
  pool.query(
    'SELECT * FROM workflows WHERE userId = ?',
    [userId],
    (err, workflows) => {
      if (err) return res.status(500).json({ error: 'Error fetching workflows' });
      if (workflows.length === 0) return res.json([]);

      const workflowIds = workflows.map(wf => wf.id);
      if (workflowIds.length === 0) return res.json(workflows);

      pool.query(
        'SELECT * FROM columns WHERE workflowId IN (?)',
        [workflowIds],
        (err, columns) => {
          if (err) return res.status(500).json({ error: 'Error fetching columns' });

          const workflowsWithColumns = workflows.map(wf => ({
            ...wf,
            columns: columns.filter(col => col.workflowId === wf.id)
          }));
          res.json(workflowsWithColumns);
        }
      );
    }
  );
});

// Create a new task for a column
app.post('/api/tasks', (req, res) => {
  const { title, description, priority, dueDate, file, columnId } = req.body;
  if (!title || !columnId) {
    return res.status(400).json({ error: 'Title and columnId are required' });
  }
  pool.query(
    'INSERT INTO tasks (title, description, priority, dueDate, file, columnId) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, priority, dueDate, file, columnId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error creating task' });
      }
      res.status(201).json({
        id: results.insertId,
        title,
        description,
        priority,
        dueDate,
        file,
        columnId,
        completed: false
      });
    }
  );
});

// Get all tasks for a column
app.get('/api/columns/:columnId/tasks', (req, res) => {
  const { columnId } = req.params;
  pool.query(
    'SELECT * FROM tasks WHERE columnId = ?',
    [columnId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching tasks' });
      }
      res.json(results);
    }
  );
});

// Endpoint to serve task file
app.get('/api/tasks/:taskId/file', (req, res) => {
  const { taskId } = req.params;
  pool.query(
    'SELECT file, fileName, fileType FROM tasks WHERE id = ?',
    [taskId],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
      const { file, fileName, fileType } = results[0];
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Type', fileType);
      res.send(file);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Next step to display the information to the frontend

// Add this with your other endpoints
app.put('/api/columns/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, color } = req.body;

  console.log('Updating column:', { id, title, description, color });

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  pool.query(
    'UPDATE columns SET title = ?, description = ?, color = ? WHERE id = ?',
    [title, description, color, id],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error updating column' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Column not found' });
      }

      res.json({ 
        message: 'Column updated successfully',
        column: { id, title, description, color }
      });
    }
  );
});

// Add the delete column endpoint
app.delete('/api/columns/:id', (req, res) => {
  const { id } = req.params;

  console.log('Deleting column:', id);

  pool.query('DELETE FROM columns WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error deleting column' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.json({ message: 'Column deleted successfully' });
  });
});

// Update task endpoint
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate } = req.body;

  console.log('Updating task:', { id, title, description, priority, dueDate });

  pool.query(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, dueDate = ? WHERE id = ?',
    [title, description, priority, dueDate, id],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error updating task' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ 
        message: 'Task updated successfully',
        task: { id, title, description, priority, dueDate }
      });
    }
  );
});

// Add this with your other endpoints
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  console.log('Deleting task:', id);

  pool.query('DELETE FROM tasks WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error deleting task' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
});