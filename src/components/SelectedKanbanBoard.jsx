import { useState, useMemo } from 'react';
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
  onCompleteTask,
  onEditWorkflow,
  userProfile,
  theme
}) {
  const [showColumn, setShowColumn] = useState(false);

  function handleShowCreateColumn() {
    setShowColumn((prev) => !prev);
  }

  function handleCreateColumn(columnData) {
    onAddColumn(columnData);
  }

  // Memoize theme styles
  const themeStyles = useMemo(() => {
    const themeMap = {
      'bg-gradient-to-r from-blue-800 to-blue-900': 'from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-800 to-green-900': 'from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-800 to-purple-900': 'from-purple-500 to-purple-600',
      'bg-gradient-to-r from-red-800 to-red-900': 'from-red-500 to-red-600',
      'bg-gradient-to-r from-yellow-800 to-yellow-900': 'from-yellow-500 to-yellow-600',
      'bg-gradient-to-r from-indigo-800 to-indigo-900': 'from-indigo-500 to-indigo-600',
      'bg-gradient-to-r from-gray-800 to-gray-900': 'from-gray-500 to-gray-600'
    };
    return themeMap[theme?.title] || 'from-blue-500 to-blue-600';
  }, [theme?.title]);

  // Memoize project statistics calculation
  const projectStats = useMemo(() => {
    if (!workFlow?.columns || !Array.isArray(workFlow.columns)) {
      return { total: 0, completed: 0, overdue: 0 };
    }
    
    let total = 0;
    let completed = 0;
    let overdue = 0;
    
    workFlow.columns.forEach(column => {
      if (column.tasks && Array.isArray(column.tasks)) {
        column.tasks.forEach(task => {
          total++;
          
          // Check if task is marked as completed OR in a "done/complete" column
          if (task.completed || 
              column.title?.toLowerCase().includes('done') || 
              column.title?.toLowerCase().includes('complete')) {
            completed++;
          }
          
          // Check for overdue tasks (only if not completed)
          if (!task.completed && task.dueDate && new Date(task.dueDate) < new Date()) {
            overdue++;
          }
        });
      }
    });
    
    return { total, completed, overdue };
  }, [workFlow?.columns]);

  // Memoize completion percentage
  const completionPercentage = useMemo(() => {
    return projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0;
  }, [projectStats.total, projectStats.completed]);

  return (
    <main className="flex flex-col flex-grow p-6 bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-auto min-h-screen">
      {/* Header Section */}
      <Header 
        workFlow={workFlow} 
        userProfile={userProfile} 
        theme={theme} 
        onEditWorkflow={onEditWorkflow}
      />

      {/* Project Statistics */}
      {projectStats.total > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.total}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Progress</p>
                <p className="text-2xl font-bold text-blue-600">{completionPercentage}%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Overdue</p>
                <p className={`text-2xl font-bold ${projectStats.overdue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {projectStats.overdue}
                </p>
              </div>
              <div className="text-3xl">{projectStats.overdue > 0 ? '⚠️' : '🎯'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {projectStats.total > 0 && (
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${themeStyles} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>{projectStats.completed} completed</span>
            <span>{projectStats.total - projectStats.completed} remaining</span>
          </div>
        </div>
      )}

      {/* Add Column Section */}
      <div className="mb-6">
        {showColumn ? (
          <div className="flex justify-center">
            <CreateColumn 
              onAdd={handleCreateColumn} 
              done={handleShowCreateColumn} 
              theme={theme} 
            />
          </div>
        ) : (
          <button
            onClick={handleShowCreateColumn}
            className={`bg-gradient-to-r ${themeStyles} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3`}
          >
            <span className="text-lg">➕</span>
            Create Column
          </button>
        )}
      </div>

      {/* Columns Section */}
      {workFlow.columns?.length > 0 ? (
        <div className="flex-1">
          <Column
            columns={workFlow.columns}
            workFlow={workFlow}
            onAddTask={onAddTask}
            onDeleteColumn={onDeleteColumn}
            onEditColumn={onEditColumn}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onAddTaskFile={onAddTaskFile}
            onCompleteTask={onCompleteTask}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 max-w-md">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Organize?</h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first column to organize your tasks. 
              Common columns include "To Do", "In Progress", and "Done".
            </p>
            <button
              onClick={handleShowCreateColumn}
              className={`bg-gradient-to-r ${themeStyles} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto`}
            >
              <span className="text-lg">🚀</span>
              Create First Column
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Tips */}
      {workFlow.columns?.length === 0 && (
        <div className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-xl shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold mb-1">Quick Tip</h4>
              <p className="text-sm">Try starting with these common columns: "Backlog", "To Do", "In Progress", "Review", "Done"</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}