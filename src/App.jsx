import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateKanbanBoard from './components/createKanbanBoard.jsx';
import Sidebar from './components/Sidebar';
import SelectedKanbanBoard from './components/SelectedKanbanBoard';
import NoBoardSelected from './components/NoBoardSelected';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUpPage';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectsState, setProjectsState] = useState({
    selectedWorkFlowId: undefined,
    WorkFlow: []
  });

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  function handleAddColumnToWorkflow(columnData) {
    setProjectsState((prevState) => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          return {
            ...workflow,
            columns: [{ id: Math.random(), ...columnData }, ...workflow.columns]
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
    setProjectsState(prevState => ({ ...prevState, selectedWorkFlowId: null }));
  }

  function handleCancelWorkFlow() {
    setProjectsState(prevState => ({ ...prevState, selectedWorkFlowId: undefined }));
  }

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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <main className="h-screen flex gap-8">
                <Sidebar
                  startWorkFlow={handleStartWorkFlow}
                  workFlows={projectsState.WorkFlow}
                  onSelectKanban={handleSelectKanban}
                />
                {projectsState.selectedWorkFlowId === null ? (
                  <CreateKanbanBoard
                    onAdd={handleAddWorkFlow}
                    onCancel={handleCancelWorkFlow}
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
                  />
                )}
              </main>
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
