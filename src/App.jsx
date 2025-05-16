import { useState } from 'react'
import CreateKanbanBoard from './components/createKanbanBoard.jsx'
import Sidebar from './components/Sidebar'
import SelectedKanbanBoard from './components/SelectedKanbanBoard'
import './App.css'
import NoBoardSelected from './components/NoBoardSelected';

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedWorkFlowId: undefined,
    WorkFlow: []
  });
  
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
        columns:[]
      }
      return {
        ...prevState,
        selectedWorkFlowId: undefined,
        WorkFlow: [newWorkFlow, ...prevState.WorkFlow]
      }
    })
  }

  // Selecting the Kanban Board from the Sidebar 
  function handleSelectKanban(id){ 
    setProjectsState((prevState)=>{
      return{
        ...prevState,
        selectedWorkFlowId:id
      } 

    })
  }
  // to find the selected project when you click on the sidebar
  let selectedWorkFlow = projectsState.WorkFlow.find(
    (workflow)=>workflow.id === projectsState.selectedWorkFlowId
  );

  let content = (<SelectedKanbanBoard workFlow={selectedWorkFlow} onAddColumn={handleAddColumnToWorkflow} />);

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
