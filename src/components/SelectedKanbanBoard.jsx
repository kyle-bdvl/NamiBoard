import {useState} from 'react';
import Header from './Header.jsx';
import CreateColumn from './CreateColumn.jsx';
import Column from './Columns.jsx';
export default function SelectedKanbanBoard({ workFlow, onAddColumn }) {
  const [showColumn, setShowColumn] = useState(false);

  function handleShowCreateColumn() {
    setShowColumn(prev => !prev);
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
          className="max-w-min py-1.5 px-5 bg-amber-200 rounded-md" 
          onClick={handleShowCreateColumn}
        >
          Create Column
        </button>
      )}
      <Column columns={workFlow.columns } />
    </main>
  );
}
