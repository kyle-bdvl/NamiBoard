import {useState} from 'react';
import Header from './Header.jsx';
import CreateColumn from './CreateColumn.jsx';
import Column from './Columns.jsx';

export default function SelectedKanbanBoard({ workFlow, onAddColumn,onAddTask, onDeleteColumn, onDeleteTask }) {
  const [showColumn, setShowColumn] = useState(false);

  function handleShowCreateColumn() {
    setShowColumn(!showColumn);
  }

  function handleCreateColumn(title) {
    onAddColumn(title);
  }

  return (
    <main className="flex flex-col flex-grow p-5">
      <Header workFlow={workFlow} />
      {showColumn ? (
        <CreateColumn onAdd={handleCreateColumn} done={handleShowCreateColumn} />
      ) : (
        <button 
          className="w-37 py-1.5 px-3 cursor-pointer bg-blue-500 text-white rounded-md duration-200 hover:bg-blue-700 hover:drop-shadow-sm" 
          onClick={handleShowCreateColumn}>
          Create Column +
        </button>
      )}
      <Column columns={workFlow.columns} onAddTask={onAddTask} onDeleteColumn={onDeleteColumn} onDeleteTask={onDeleteTask}/>
    </main>
  );
}