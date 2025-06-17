import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Settings from './components/Settings';
import CreateKanbanBoard from './components/createKanbanBoard.jsx';
import Sidebar from './components/Sidebar';
import SelectedKanbanBoard from './components/SelectedKanbanBoard';
import NoBoardSelected from './components/NoBoardSelected';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUpPage';
import AboutUs from './components/AboutUs.jsx';
import Button from './components/Buttons';

import './App.css';

function App() {
  // Backend state
    // Example:
  // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  // if (!response.ok) throw new Error('Invalid credentials');
  // return await response.json();

  // TEMP: Remove this block when backend is ready
  const [backend, setBackend] = useState([{}]);
  // const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackend(data)
      }
    ).catch(
      err => console.error(err)
    );
  }, [])

  // App state
  const [loggedIn, setLoggedIn] = useState(false);
  const [SideBar, setHideSideBar] = useState(true);
  const [projectsState, setProjectsState] = useState({
    selectedWorkFlowId: undefined,
    WorkFlow: []
  });
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Theme state with enhanced colors
  const [theme, setTheme] = useState({ 
    sidebar: 'bg-blue-200', 
    title: 'bg-blue-900',
    accent: 'blue'
  });


  // User performance tracking for analytics
  const [userActivity, setUserActivity] = useState({
    tasksCompleted: 0,
    projectsCreated: 0,
    weeklyProgress: [],
    productivityScore: 85,
    completionRate: 72
  });

  // Update the handleLogin function
  function handleLogin(userData) {
    if (!userData) {
      console.error('No user data provided to handleLogin');
      return;
    }

    console.log('Login successful with data:', userData);
    
    // Set both login state and user profile
    setLoggedIn(true);
    setUserProfile({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
    });
    
    // Store both in localStorage
    localStorage.setItem('userProfile', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    // Fetch workflows immediately after login
    fetchUserWorkflows(userData.email);
  }

  // Add this helper function
  const fetchUserWorkflows = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/workflows/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      const workflows = await response.json();
      setProjectsState(prev => ({
        ...prev,
        WorkFlow: workflows
      }));
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  // Update the useEffect for checking stored user data
  useEffect(() => {
    const storedUserData = localStorage.getItem('userProfile');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUserData && isLoggedIn === 'true') {
      const userData = JSON.parse(storedUserData);
      setUserProfile(userData);
      setLoggedIn(true);
    } else {
      // If either is missing, reset both
      setLoggedIn(false);
      setUserProfile(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('isLoggedIn');
    }
  }, []);

  // Update logout handling to clear user data
  function handleLogout() {
    setLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    setProjectsState({
      selectedWorkFlowId: undefined,
      WorkFlow: []
    });
  }

  // Enhanced task priority sorting function
  function sortTasksByPriorityAndDate(tasks) {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return [...tasks].sort((a, b) => {
      // First sort by priority
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by due date (earlier dates first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }

  async function handleAddColumnToWorkflow(columnData) {
    // 1. Create the column in the backend
    const response = await fetch('/api/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: columnData.title,
        description: columnData.description,
        color: columnData.color,
        workflowId: columnData.workflowId
      })
    });

    if (!response.ok) {
      alert('Failed to create column');
      return;
    }

    // 2. Fetch updated columns for the workflow
    const columnsRes = await fetch(`/api/workflows/${columnData.workflowId}/columns`);
    const columns = await columnsRes.json();

    // 3. Update the workflow in your state with the new columns
    setProjectsState(prevState => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === columnData.workflowId) {
          return { ...workflow, columns };
        }
        return workflow;
      });
      return { ...prevState, WorkFlow: updatedWorkflows };
    });
  }

  async function handleDeleteColumn(columnId) {
    try {
      const response = await fetch(`http://localhost:5000/api/columns/${columnId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete column');
      }

      // Update frontend state after successful deletion
      setProjectsState((prevState) => {
        const updatedWorkflows = prevState.WorkFlow.map(workflow => {
          if (workflow.id === prevState.selectedWorkFlowId) {
            return {
              ...workflow,
              columns: workflow.columns.filter(column => column.id !== columnId)
            };
          }
          return workflow;
        });

        return {
          ...prevState,
          WorkFlow: updatedWorkflows
        };
      });
    } catch (error) {
      console.error('Error deleting column:', error);
      alert('Failed to delete column: ' + error.message);
    }
  }

  async function handleAddTaskToColumn(columnId, title, description, file, priority = 'medium', dueDate = null) {
    // 1. Create the task in the backend
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,
        file: file ? file.name : null, // You may want to handle file uploads separately
        columnId
      })
    });

    if (!response.ok) {
      alert('Failed to create task');
      return;
    }

    // 2. Fetch updated tasks for the column
    const tasksRes = await fetch(`/api/columns/${columnId}/tasks`);
    const tasks = await tasksRes.json();

    // 3. Update the column in your state with the new tasks
    setProjectsState(prevState => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column => {
            if (column.id === columnId) {
              return { ...column, tasks };
            }
            return column;
          });
          return { ...workflow, columns: updatedColumns };
        }
        return workflow;
      });
      return { ...prevState, WorkFlow: updatedWorkflows };
    });
  }

  // Replace the existing handleDeleteTask function with this:
  async function handleDeleteTask(columnId, taskId) {
    try {
      // First, delete from database
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }

      // Only update frontend state after successful database deletion
      setProjectsState((prevState) => {
        const updatedWorkflows = prevState.WorkFlow.map((workflow) => {
          if (workflow.id === prevState.selectedWorkFlowId) {
            const updatedColumns = workflow.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  tasks: (column.tasks || []).filter((task) => task.id !== taskId)
                };
              }
              return column;
            });

            return {
              ...workflow,
              columns: updatedColumns
            };
          }
          return workflow;
        });

        return {
          ...prevState,
          WorkFlow: updatedWorkflows
        };
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task: ' + error.message);
    }
  }

  function handleEditColumn(columnId, newTitle, newDescription) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column =>
            column.id === columnId
              ? { ...column, title: newTitle, description: newDescription }
              : column
          );
          return { ...workflow, columns: updatedColumns };
        }
        return workflow;
      });
      return { ...prevState, WorkFlow: updatedWorkflows };
    });
  }

  async function handleEditTask(columnId, taskId, newTitle, newDescription, newPriority, newDueDate) {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority,
          dueDate: newDueDate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update frontend state after successful database update
      setProjectsState((prevState) => {
        const updatedWorkflows = prevState.WorkFlow.map(workflow => {
          if (workflow.id === prevState.selectedWorkFlowId) {
            const updatedColumns = workflow.columns.map(column => {
              if (column.id === columnId) {
                let updatedTasks = (column.tasks || []).map(task =>
                  task.id === taskId
                    ? { 
                        ...task, 
                        title: newTitle, 
                        description: newDescription,
                        priority: newPriority || task.priority,
                        dueDate: newDueDate !== undefined ? newDueDate : task.dueDate
                      }
                    : task
                );
                
                // Re-sort tasks after editing
                updatedTasks = sortTasksByPriorityAndDate(updatedTasks);
                
                return { ...column, tasks: updatedTasks };
              }
              return column;
            });
            return { ...workflow, columns: updatedColumns };
          }
          return workflow;
        });
        return { ...prevState, WorkFlow: updatedWorkflows };
      });

    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task: ' + error.message);
    }
  }

  function handleAddTaskFile(columnId, taskId, file) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column => {
            if (column.id === columnId) {
              const updatedTasks = (column.tasks || []).map(task =>
                task.id === taskId ? { ...task, file } : task
              );
              return { ...column, tasks: updatedTasks };
            }
            return column;
          });
          return { ...workflow, columns: updatedColumns };
        }
        return workflow;
      });
      return { ...prevState, WorkFlow: updatedWorkflows };
    });
  }

  function handleCompleteTask(columnId, taskId, completed) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map((workflow) => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map((column) => {
            if (column.id === columnId) {
              const updatedTasks = (column.tasks || []).map((task) => 
                task.id === taskId 
                  ? { ...task, completed, completedAt: completed ? new Date().toISOString() : null }
                  : task
              );
              return {
                ...column,
                tasks: updatedTasks
              };
            }
            return column;
          });

          return {
            ...workflow,
            columns: updatedColumns
          };
        }
        return workflow;
      });

      // Update user activity when task is completed
      if (completed) {
        setUserActivity(prev => ({
          ...prev,
          tasksCompleted: prev.tasksCompleted + 1
        }));
      }

      return {
        ...prevState,
        WorkFlow: updatedWorkflows
      };
    });
  }

  function handleStartWorkFlow() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedWorkFlowId: null,
      }
    })
  }

  function handleCancelWorkFlow() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedWorkFlowId: undefined,
      };
    })
  }

  // Modify handleAddWorkFlow function
  async function handleAddWorkFlow(dataPassed) {
    try {
      console.log('Current user profile:', userProfile); // Add debug logging
    
      if (!userProfile?.email) {
        console.log('Login state:', loggedIn); // Add debug logging
        throw new Error('User not logged in. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...dataPassed,
          userId: userProfile.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workflow');
      }

      const newWorkflow = await response.json();
      console.log('Workflow created:', newWorkflow); // Add debug logging

      setProjectsState((prevState) => ({
        ...prevState,
        selectedWorkFlowId: undefined,
        WorkFlow: [newWorkflow, ...prevState.WorkFlow]
      }));

    } catch (error) {
      console.error('Error creating workflow:', error);
      alert(error.message);
    }
  }

  // Modify the useEffect for fetching workflows
  useEffect(() => {
    const fetchUserWorkflows = async () => {
      if (userProfile?.email) {
        try {
          console.log('Fetching workflows for:', userProfile.email);
          const response = await fetch(`http://localhost:5000/api/workflows/${encodeURIComponent(userProfile.email)}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch workflows');
          }
          
          const workflows = await response.json();
          console.log('Fetched workflows:', workflows);
          
          setProjectsState(prev => ({
            ...prev,
            WorkFlow: workflows
          }));
        } catch (error) {
          console.error('Error fetching workflows:', error);
        }
      }
    };

    fetchUserWorkflows();
  }, [userProfile?.email, loggedIn]); // Add loggedIn to dependencies

  async function handleEditWorkflow(workflowId, updateData) {
    try {
      const response = await fetch(`http://localhost:5000/api/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update workflow');
      }

      setProjectsState(prevState => ({
        ...prevState,
        WorkFlow: prevState.WorkFlow.map(workflow =>
          workflow.id === workflowId
            ? { 
                ...workflow, 
                ...updateData
              }
            : workflow
        )
      }));

    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  }

  async function handleDeleteWorkflow(workflowId) {
    try {
      const response = await fetch(`http://localhost:5000/api/workflows/${workflowId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }

      setProjectsState(prevState => ({
        ...prevState,
        selectedWorkFlowId: prevState.selectedWorkFlowId === workflowId ? undefined : prevState.selectedWorkFlowId,
        WorkFlow: prevState.WorkFlow.filter(workflow => workflow.id !== workflowId)
      }));

    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  }

  // Check for upcoming deadlines 
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
    
    };

    // Only check on mount and when workflows change
    checkDeadlines();
    
    // Check daily instead of constantly
    const interval = setInterval(checkDeadlines, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [projectsState.WorkFlow.length]); // Only depend on length to avoid constant re-runs

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };
  console.log(projectsState)

  async function handleSelectKanban(workflowId) {
    setProjectsState(prevState => ({
      ...prevState,
      selectedWorkFlowId: workflowId
    }));

    try {
      const columnsRes = await fetch(`/api/workflows/${workflowId}/columns`);
      let columns = await columnsRes.json();

      // Fetch tasks for each column
      columns = await Promise.all(
        columns.map(async (col) => {
          const tasksRes = await fetch(`/api/columns/${col.id}/tasks`);
          const tasks = await tasksRes.json();
          return { ...col, tasks };
        })
      );

      setProjectsState(prevState => ({
        ...prevState,
        WorkFlow: prevState.WorkFlow.map(wf =>
          wf.id === workflowId ? { ...wf, columns } : wf
        )
      }));
    } catch (err) {
      console.error('Error fetching columns or tasks for workflow:', err);
    }
  }

  return (
    <>
      {loggedIn ? (
        <main className="h-screen flex relative bg-gradient-to-br from-slate-50 to-slate-100">
          
          
          {SideBar ? (
            <Sidebar
              startWorkFlow={handleStartWorkFlow}
              workFlows={projectsState.WorkFlow}
              onSelectKanban={handleSelectKanban}
              onSideBarToggle={() => setHideSideBar(!SideBar)}
              onLogout={handleLogout}
              settingsClicked={settingsClicked}
              setSettingsClicked={setSettingsClicked}
              selectedWorkFlowId={projectsState.selectedWorkFlowId}
              theme={theme}
              setTheme={setTheme}
              onEditWorkflow={handleEditWorkflow}
              onDeleteWorkflow={handleDeleteWorkflow}
              userProfile={userProfile}
            />
          ) : (
            <button
              onClick={() => setHideSideBar(!SideBar)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 text-white p-2 rounded-xl fixed top-4 left-4 z-50 hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 shadow-lg"
              aria-label="Toggle Sidebar"
            >
              <img
                src="../src/assets/chevron-triple-right.svg"
                alt="Show Sidebar"
                className="w-6 h-6"
              />
            </button>
          )}

          {/* Main content area */}
          <div className={`flex-1 overflow-auto transition-[margin] duration-500 ease-in-out ${SideBar ? "ml-0" : "ml-20"}`}>
            <Routes>
              <Route
                path="/"
                element={
                  projectsState.selectedWorkFlowId === null ? (
                    <CreateKanbanBoard
                      onAdd={handleAddWorkFlow}
                      onCancel={handleCancelWorkFlow}
                      theme={theme}
                    />
                  ) : projectsState.selectedWorkFlowId === undefined ? (
                    <NoBoardSelected startWorkFlow={handleStartWorkFlow} />
                  ) : (
                    
                    <SelectedKanbanBoard
                      workFlow={projectsState.WorkFlow.find(
                        workflow => workflow.id === projectsState.selectedWorkFlowId
                      )}
                      onAddColumn={handleAddColumnToWorkflow}
                      onAddTask={handleAddTaskToColumn}
                      onDeleteColumn={handleDeleteColumn}
                      onEditColumn={handleEditColumn}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                      onAddTaskFile={handleAddTaskFile}
                      onCompleteTask={handleCompleteTask}
                      onEditWorkflow={handleEditWorkflow}
                      userProfile={userProfile}
                      theme={theme}  
                    />
                  )
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    settingsClicked={settingsClicked}
                    setSettingsClicked={setSettingsClicked}
                    theme={theme}
                  />
                }
              />
              
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} backend={backend}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;