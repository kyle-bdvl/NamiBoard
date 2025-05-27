import { useState } from 'react';
import Header from './Header.jsx';
import CreateColumn from './CreateColumn.jsx';
import Column from './Columns.jsx';

export default function SelectedKanbanBoard({
  workFlow,
  onAddColumn,
  onAddTask,
  onDeleteColumn,
  onDeleteTask,
  userProfile
}) {
  const [showColumn, setShowColumn] = useState(false);

  function handleShowCreateColumn() {
    setShowColumn((prev) => !prev);
  }

  function handleCreateColumn(title) {
    onAddColumn(title);
  }

  return (
    <main className="flex flex-col flex-grow p-6 bg-slate-100 overflow-x-auto min-h-screen">
      {/* Header Section */}
      <Header workFlow={workFlow} userProfile={userProfile} />

      {/* Add Column Section */}
      <div className="mb-6">
        {showColumn ? (
          <CreateColumn onAdd={handleCreateColumn} done={handleShowCreateColumn} />
        ) : (
          <button
            onClick={handleShowCreateColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition duration-200"
          >
            + Create Column
          </button>
        )}
      </div>

      {/* Columns Section */}
      {workFlow.columns?.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            columns={workFlow.columns}
            onAddTask={onAddTask}
            onDeleteColumn={onDeleteColumn}
            onDeleteTask={onDeleteTask}
          />
        </div>
      ) : (
        <div className="text-gray-500 italic">No columns yet. Start by adding one.</div>
      )}
    </main>
  );
}