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
  const [backend, setBackend] = useState([{}]);

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
  const [userProfile, setUserProfile] = useState({
    firstName: "Molly",
    lastName: "Potter",
    email: "molly@example.com"
  });
  
  // Theme state with enhanced colors
  const [theme, setTheme] = useState({ 
    sidebar: 'bg-blue-200', 
    title: 'bg-blue-900',
    accent: 'blue'
  });

  // Notification state
  const [notifications, setNotifications] = useState([]);

  // User performance tracking for analytics
  const [userActivity, setUserActivity] = useState({
    tasksCompleted: 0,
    projectsCreated: 0,
    weeklyProgress: [],
    productivityScore: 85,
    completionRate: 72
  });

  function handleLogin() {
    setLoggedIn(true);
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

  function handleAddColumnToWorkflow(columnData) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          return {
            ...workflow,
            columns: [{
              id: Math.random(),
              ...columnData,
              color: columnData.color || 'bg-gradient-to-br from-blue-50 to-blue-100',
              tasks: []
            }, ...workflow.columns]
          };
        }
        return workflow;
      });

      return {
        ...prevState,
        WorkFlow: updatedWorkflows
      };
    });
  }

  function handleDeleteColumn(columnId) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.filter(column => column.id !== columnId);
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
  }

  function handleAddTaskToColumn(columnId, title, description, file, priority = 'medium', dueDate = null) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column => {
            if (column.id === columnId) {
              const newTask = {
                id: Date.now(),
                title,
                description,
                file: file || null,
                priority,
                dueDate,
                createdAt: new Date().toISOString(),
                completed: false
              };
              
              const updatedTasks = sortTasksByPriorityAndDate([
                ...(column.tasks || []),
                newTask
              ]);
              
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

      // Update user activity
      setUserActivity(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1
      }));

      return {
        ...prevState,
        WorkFlow: updatedWorkflows
      };
    });
  }

  function handleDeleteTask(columnId, taskId) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map((workflow) => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map((column) => {
            if (column.id === columnId) {
              const updatedTasks = (column.tasks || []).filter((task) => task.id !== taskId);
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

      return {
        ...prevState,
        WorkFlow: updatedWorkflows
      };
    });
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

  function handleEditTask(columnId, taskId, newTitle, newDescription, newPriority, newDueDate) {
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

  function handleAddWorkFlow(dataPassed) {
    setProjectsState((prevState) => {
      const workFlowId = Math.random();
      const newWorkFlow = {
        ...dataPassed,
        id: workFlowId,
        columns: [],
        createdAt: new Date().toISOString()
      };
      
      // Update user activity
      setUserActivity(prev => ({
        ...prev,
        projectsCreated: prev.projectsCreated + 1
      }));
      
      return {
        ...prevState,
        selectedWorkFlowId: undefined,
        WorkFlow: [newWorkFlow, ...prevState.WorkFlow]
      };
    });
  }

  function handleSelectKanban(id) {
    setProjectsState(prevState => ({ ...prevState, selectedWorkFlowId: id }));
  }

  function handleEditWorkflow(workflowId, updateData) {
    setProjectsState(prevState => ({
      ...prevState,
      WorkFlow: prevState.WorkFlow.map(workflow =>
        workflow.id === workflowId
          ? { 
              ...workflow, 
              title: updateData.title || workflow.title,
              objective: updateData.objective || workflow.objective,
              dueDate: updateData.dueDate || workflow.dueDate
            }
          : workflow
      )
    }));
  }

  function handleDeleteWorkflow(workflowId) {
    setProjectsState(prevState => ({
      ...prevState,
      selectedWorkFlowId: prevState.selectedWorkFlowId === workflowId ? undefined : prevState.selectedWorkFlowId,
      WorkFlow: prevState.WorkFlow.filter(workflow => workflow.id !== workflowId)
    }));
  }

  // Check for upcoming deadlines and add notifications
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      const newNotifications = [];

      if (projectsState.WorkFlow && Array.isArray(projectsState.WorkFlow)) {
        projectsState.WorkFlow.forEach(workflow => {
          if (workflow.dueDate) {
            const dueDate = new Date(workflow.dueDate);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            if ([7, 3, 1].includes(daysUntilDue) && daysUntilDue > 0) {
              newNotifications.push({
                id: `deadline-${workflow.id}-${daysUntilDue}`,
                type: 'deadline',
                title: `Project Due Soon`,
                message: `"${workflow.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
                timestamp: new Date().toISOString(),
                workflowId: workflow.id
              });
            }
          }
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [
          ...newNotifications.filter(newNotif => 
            !prev.some(existingNotif => existingNotif.id === newNotif.id)
          ),
          ...prev
        ]);
      }
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
              onLogout={() => setLoggedIn(false)}
              settingsClicked={settingsClicked}
              setSettingsClicked={setSettingsClicked}
              selectedWorkFlowId={projectsState.selectedWorkFlowId}
              theme={theme}
              setTheme={setTheme}
              onEditWorkflow={handleEditWorkflow}
              onDeleteWorkflow={handleDeleteWorkflow}
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