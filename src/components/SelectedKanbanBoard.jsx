import React, { useState } from 'react';
import Header from './Header.jsx';
import CreateColumn from './CreateColumn.jsx';
import Column from './Columns.jsx';

export default function SelectedKanbanBoard({
  workFlow,
  onAddColumn,
  onAddTask,
  onDeleteColumn,
  onEditColumn,
  onDeleteTask,
  onEditTask,
  onAddTaskFile,
  onCompleteTask, // new callback passed down
  userProfile,
  theme
}) {
  const [showColumn, setShowColumn] = useState(false);

  function handleShowCreateColumn() {
    setShowColumn((prev) => !prev);
  }

  function handleCreateColumn(title) {
    onAddColumn(title);
  }

  // Calculate tasks across all columns
  const allTasks = workFlow.columns?.flatMap(column => column.tasks || []) || [];
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.completed).length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  let hoverClasses = '';

  if (theme.title === 'bg-blue-900') {
    hoverClasses = 'hover:bg-blue-900 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-green-900') {
    hoverClasses = 'hover:bg-green-900 hover:text-white hover:ring-2 hover:ring-green-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-purple-900') {
    hoverClasses = 'hover:bg-purple-900 hover:text-white hover:ring-2 hover:ring-purple-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-red-900') {
    hoverClasses = 'hover:bg-red-900 hover:text-white hover:ring-2 hover:ring-red-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-yellow-900') {
    hoverClasses = 'hover:bg-yellow-900 hover:text-white hover:ring-2 hover:ring-yellow-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-indigo-900') {
    hoverClasses = 'hover:bg-indigo-900 hover:text-white hover:ring-2 hover:ring-indigo-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-gray-900') {
    hoverClasses = 'hover:bg-gray-900 hover:text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2';
  } else {
    hoverClasses = 'hover:bg-blue-900 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  }

  return (
    <main className="flex flex-col flex-grow p-6 bg-slate-100 overflow-x-auto min-h-screen">
      {/* Header Section */}
      <Header workFlow={workFlow} userProfile={userProfile} theme={theme} />
      
      {/* Progress Section */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">
          {completedTasks} of {totalTasks} tasks completed
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      {/* Add Column Section */}
      <div className="mb-6">
        {showColumn ? (
          <CreateColumn onAdd={handleCreateColumn} done={handleShowCreateColumn} theme={theme} />
        ) : (
          <button
            onClick={handleShowCreateColumn}
            className={`px-4 py-2 ${theme.sidebar}  text-black rounded-lg  hover:text-white ${hoverClasses} shadow-sm transition duration-200`}>
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
            onEditColumn={onEditColumn}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onAddTaskFile={onAddTaskFile}
            onCompleteTask={onCompleteTask} // passing down callback for tasks
          />
        </div>
      ) : (
        <div className="text-gray-500 italic">No columns yet. Start by adding one.</div>
      )}
    </main>
  );
}