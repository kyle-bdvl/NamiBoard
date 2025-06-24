###Namiboard - Kanban Task Management App
A full-stack Kanban board application built with React, Express, and MySQL. This app allows users to manage workflows, columns, and tasks with user authentication and persistent storage.

###Features
User Authentication: Sign up and log in with secure credentials.
Personal Workflows: Each user has their own set of workflows (Kanban boards).
Workflow Management: Create, edit, and delete workflows with objectives and due dates.
Column Management: Add, edit, and delete columns within workflows.
Task Management: Add, edit, complete, and delete tasks within columns.
Persistent Storage: All data is stored in a MySQL database.
Responsive UI: Built with React and Tailwind CSS for a modern, responsive experience.
User Profile: Update your profile and settings.
Analytics: Track productivity and completion rates.
Real-Time Sync: UI updates reflect database changes immediately.

## Tech Stack 
Frontend: React, React Router, Tailwind CSS
Backend: Node.js, Express
Database: MySQL
Other: CORS, dotenv

###Setup for NamiBoard
```
git clone https://github.com/yourusername/kanban-app.git
cd kanban-app
```

### install dependencies (frontend)
```
npm install
```

### install dependencies (backend) 
Note : open another terminal to run the backend simutaneously with the frontend
```
cd backend
npm install
```

## 📦 Dependencies Used

### Frontend (`package.json`)
```
react  
react-dom  
react-router-dom  
@vitejs/plugin-react   # if using Vite  
vite                   # if using Vite  
tailwindcss            # if using Tailwind for styling  
autoprefixer           # for Tailwind  
postcss                # for Tailwind  
```
### Backend (modules used) 
```
express  
mysql2  
cors  
dotenv   # for environment variables (if used)  
```

## Setting up Database (creating tables) 
```
CREATE TABLE users (
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    objective TEXT,
    dueDate DATE,
    userId VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE columns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflowId INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(50),
    FOREIGN KEY (workflowId) REFERENCES workflows(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    columnId INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    dueDate DATE,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (columnId) REFERENCES columns(id) ON DELETE CASCADE
);
```

### Start backend 
```
cd backend
npm run dev
```

### start FrontEnd
```
npm run dev
```
