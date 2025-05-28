import { useState } from 'react';
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
  // Lifted Theme state
  const [theme, setTheme] = useState({ sidebar: 'bg-blue-200', title: 'bg-blue-900' });


  function handleLogin() {
    setLoggedIn(true);
  };


  function handleAddColumnToWorkflow(columnData) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          return {
            ...workflow,
            columns: [{
              id: Math.random(),
              ...columnData,
              color: columnData.color || 'bg-blue-100' // Add color support
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

  function handleAddTaskToColumn(columnId, title, description, file) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column => {
            if (column.id === columnId) {
              const updatedTasks = [
                ...(column.tasks || []),
                {
                  id: Date.now(),
                  title,
                  description,
                  file: file || null,
                },
              ];
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

  function handleEditTask(columnId, taskId, newTitle, newDescription) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          const updatedColumns = workflow.columns.map(column => {
            if (column.id === columnId) {
              const updatedTasks = (column.tasks || []).map(task =>
                task.id === taskId
                  ? { ...task, title: newTitle, description: newDescription }
                  : task
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

  function handleStartWorkFlow() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedWorkFlowId: null,
      }
    })
  }

  // function to let to user click off if they don't want to add a workFlow 
  function handleCancelWorkFlow() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedWorkFlowId: undefined,
      };
    })
  }

  // to save the workFlow 
  function handleAddWorkFlow(dataPassed) {
    setProjectsState((prevState) => {
      const workFlowId = Math.random();
      const newWorkFlow = {
        ...dataPassed,
        id: workFlowId,
        columns: []
      };
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

  function handleEditWorkflow(workflowId, newTitle) {
    setProjectsState(prevState => ({
      ...prevState,
      WorkFlow: prevState.WorkFlow.map(workflow =>
        workflow.id === workflowId
          ? { ...workflow, title: newTitle }
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

  return (
    <>
      {loggedIn ? (
        <main className="h-screen flex relative bg-slate-100">
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
              className="bg-gradient-to-r from-gray-400 to-gray-600 px-3 text-white p-2 rounded-md fixed top-4 left-4 z-50 hover:opacity-80 active:opacity-60 transition duration-200"
              aria-label="Toggle Sidebar"
            >
              <img
                src="../src/assets/chevron-triple-right.svg"
                alt="backButton"
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
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}
export default App;