import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CreateKanbanBoard from './components/createKanbanBoard.jsx'
import Sidebar from './components/Sidebar'
import SelectedKanbanBoard from './components/SelectedKanbanBoard'
import NoBoardSelected from './components/NoBoardSelected'
import LoginPage from './components/LoginPage'
import SignUp from './components/SignUpPage'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectsState, setProjectsState] = useState({
    selectedWorkFlowId: undefined,
    WorkFlow: []
  });

  const handleLogin = () => setLoggedIn(true);

  function handleAddColumnToWorkflow(columnData) {
    setProjectsState(prevState => {
      const updatedWorkflows = prevState.WorkFlow.map(workflow => {
        if (workflow.id === prevState.selectedWorkFlowId) {
          return {
            ...workflow,
            columns: [{ id: Math.random(), ...columnData }, ...workflow.columns]
          };
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
    const workFlowId = Math.random();
    const newWorkFlow = { ...dataPassed, id: workFlowId, columns: [] };

    setProjectsState(prevState => ({
      ...prevState,
      selectedWorkFlowId: undefined,
      WorkFlow: [newWorkFlow, ...prevState.WorkFlow]
    }));
  }

  function handleSelectKanban(id) {
    setProjectsState(prevState => ({ ...prevState, selectedWorkFlowId: id }));
  }

  const selectedWorkFlow = projectsState.WorkFlow.find(
    workflow => workflow.id === projectsState.selectedWorkFlowId
  );

  let content = <SelectedKanbanBoard workFlow={selectedWorkFlow} onAddColumn={handleAddColumnToWorkflow} />;
  if (projectsState.selectedWorkFlowId === null) {
    content = <CreateKanbanBoard onAdd={handleAddWorkFlow} onCancel={handleCancelWorkFlow} />;
  } else if (projectsState.selectedWorkFlowId === undefined) {
    content = <NoBoardSelected startWorkFlow={handleStartWorkFlow} />;
  }

  return (
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
              {content}
            </main>
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      {/* Add another route for /Login */}
      <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/SignUp" element={<SignUp />} />
      {/* Redirect unknown paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
