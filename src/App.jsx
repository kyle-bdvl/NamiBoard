import { useState } from 'react'

import Sidebar from './components/Sidebar'
import KanbanBoard from './components/KanbanBoard'
import './App.css'

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined, 
    projects: [],
    tasks:[],
  });

  return (
    <>
      <div className="flex">
        <Sidebar />
        <KanbanBoard />
      </div>

    </>
  )
}

export default App
