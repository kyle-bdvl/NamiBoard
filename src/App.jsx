import { useState } from 'react'
import CreateKanbanBoard from './components/createKanbanBoard.jsx'
import Sidebar from './components/Sidebar'
import SelectedKanbanBoard from './components/SelectedKanbanBoard'
import './App.css'
import NoBoardSelected from './components/NoBoardSelected';
import LoginPage from './components/LoginPage';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectsState, setProjectsState] = useState({
    selectedWorkFlowId: undefined,
    WorkFlow: []
  });
  const handleLogin = () => {
    setLoggedIn(true);
  }
  if (!loggedIn) {
    return (
      <LoginPage onLogin={handleLogin} />
    )
  }

  // function to update the columns inside the workFlow 
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
  // ...existing code...

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

  

  // to change the page to adding a workFlow
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
      }
      return {
        ...prevState,
        selectedWorkFlowId: undefined,
        WorkFlow: [newWorkFlow, ...prevState.WorkFlow]
      }
    })
  }

  // Selecting the Kanban Board from the Sidebar 
  function handleSelectKanban(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedWorkFlowId: id
      }

    })
  }
  // to find the selected project when you click on the sidebar
  let selectedWorkFlow = projectsState.WorkFlow.find(
    (workflow) => workflow.id === projectsState.selectedWorkFlowId
  );

   let content = (<SelectedKanbanBoard
    workFlow={selectedWorkFlow}
    onAddColumn={handleAddColumnToWorkflow}
    onAddTask={handleAddTaskToColumn}
    onDeleteColumn={handleDeleteColumn}
    onEditColumn={handleEditColumn}
    onDeleteTask={handleDeleteTask}
    onEditTask={handleEditTask}
    onAddTaskFile={handleAddTaskFile}
  />);

  if (projectsState.selectedWorkFlowId === null) {
    content = (<CreateKanbanBoard onAdd={handleAddWorkFlow} onCancel={handleCancelWorkFlow} />)
  } else if (projectsState.selectedWorkFlowId === undefined) {
    content = (<NoBoardSelected startWorkFlow={handleStartWorkFlow} />);
  }
  console.log(projectsState);
  return (
    <>
      <main className="h-screen flex gap-8">
        <Sidebar
          startWorkFlow={handleStartWorkFlow}
          workFlows={projectsState.WorkFlow}
          onSelectKanban={handleSelectKanban}
        />
        {content}
      </main>

    </>
  )


}

export default App;