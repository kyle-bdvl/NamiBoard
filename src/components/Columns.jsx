import React, { useState, useMemo, useEffect } from "react";
import Task from "./Task";
import Modal from "./Modal";

export default function Columns({
  columns,
  workFlow,
  onAddTask,
  onDeleteColumn,
  onEditColumn,
  onDeleteTask,
  onEditTask,
  onAddTaskFile,
  onCompleteTask,
}) {
  const [showColumnModal, setShowColumnModal] = useState(null);
  const [editColumn, setEditColumn] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [editTask, setEditTask] = useState(null);

  // For editing column
  const [colTitle, setColTitle] = useState("");
  const [colDesc, setColDesc] = useState("");

  // For creating/editing task with new fields
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskErrors, setTaskErrors] = useState({});

  // This useEffect is to view the scrollBar
   let scrollTimeout = null;
   useEffect(() => {
      const handleScroll = (e) => {
        const element = e.target;
        element.classList.add('scrolling');
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          element.classList.remove('scrolling');
        }, 1000);
      };
  
      const scrollableElements = document.querySelectorAll('.CustomScrollbar');
      scrollableElements.forEach(element => {
        element.addEventListener('scroll', handleScroll);
      });
  
      return () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollableElements.forEach(element => {
          element.removeEventListener('scroll', handleScroll);
        });
      };
    }, []);

    // Handle column modal open for edit
    function handleEditColumnOpen(column) {
      setEditColumn(column);
      setColTitle(column.title);
      setColDesc(column.description || "");
      setShowColumnModal(column.id);
    }

    // Handle task modal open for edit
    function handleEditTaskOpen(columnId, task) {
      setEditTask({ columnId, task });
      setTaskTitle(task.title);
      setTaskDesc(task.description || "");
      setTaskPriority(task.priority || "medium");
      setTaskDueDate(task.dueDate || "");
      setShowTaskModal({ columnId, edit: true });
    }

    // Handle add task modal open
    function handleAddTaskModal(columnId) {
      setEditTask(null);
      setTaskTitle("");
      setTaskDesc("");
      setTaskPriority("medium");
      setTaskDueDate("");
      setShowTaskModal({ columnId, edit: false });
    }

    const sortTasks = (tasks) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return [...tasks].sort((a, b) => {
        // First sort by priority
        const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        if (priorityDiff !== 0) return priorityDiff;

        // Then sort by due date (earlier dates first, overdue tasks first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
    };

    // Validate task due date against workflow due date
    const validateTaskDueDate = (taskDueDate) => {
      if (!taskDueDate) return true; // Due date is optional

      const taskDate = new Date(taskDueDate);
      const workflowDueDate = new Date(workFlow?.dueDate);

      if (workFlow?.dueDate && taskDate > workflowDueDate) {
        return false;
      }

      return true;
    };

    const getMaxTaskDueDate = () => {
      return workFlow?.dueDate || null;
    };

    return (
      <div className="mt-6">
        <div className="flex flex-row gap-6 overflow-x-auto pb-4">
          {columns.map((column) => {
            const sortedTasks = sortTasks(column.tasks || []);
            const taskCount = sortedTasks.length;
            const overdueTasks = sortedTasks.filter(task =>
              task.dueDate && new Date(task.dueDate) < new Date()
            ).length;

            return (
              <div key={column.id} className={`${column.color || 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-xl shadow-sm border border-white/50 p-5 min-w-[320px] max-w-[320px] backdrop-blur-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold break-all text-gray-800 mb-1">{column.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="bg-white/70 px-2 py-1 rounded-full">
                        {taskCount} task{taskCount !== 1 ? 's' : ''}
                      </span>
                      {overdueTasks > 0 && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          {overdueTasks} overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-lg px-2 py-1 rounded-md hover:bg-white/50 transition-colors"
                    onClick={() => setShowColumnModal(column.id)}
                    aria-label="Column options"
                  >
                    ⋯
                  </button>
                </div>

                {column.description && (
                  <p className="text-sm text-gray-600 mb-4 italic">{column.description}</p>
                )}

                {/* Tasks list */}
                <div className="space-y-3 mb-4 max-h-96 CustomScrollbar overflow-y-auto">
                  {sortedTasks.map((task) => (
                    <Task
                      key={task.id}
                      task={task}
                      columnId={column.id}
                      workFlow={workFlow}
                      onDelete={() => onDeleteTask(column.id, task.id)}
                      onEdit={(title, description, priority, dueDate) =>
                        onEditTask(column.id, task.id, title, description, priority, dueDate)
                      }
                      onAddFile={(file) => onAddTaskFile(column.id, task.id, file)}
                      onCompleteTask={onCompleteTask}
                    />
                  ))}

                  {sortedTasks.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  )}
                </div>

                {/* Add task button */}
                <button
                  className="w-full bg-white/70 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => handleAddTaskModal(column.id)}
                >
                  + Add Task
                </button>

                {/* Column Modal */}
                <Modal open={showColumnModal === column.id} onClose={() => setShowColumnModal(null)}>
                  {!editColumn || editColumn.id !== column.id ? (
                    <div className="space-y-2">
                      <button
                        className="block w-full text-left py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => handleEditColumnOpen(column)}
                      >
                        ✏️ Edit Column
                      </button>
                      <button
                        className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        onClick={() => {
                          onDeleteColumn(column.id);
                          setShowColumnModal(null);
                        }}
                      >
                        🗑️ Delete Column
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        onEditColumn(editColumn.id, colTitle, colDesc);
                        setShowColumnModal(null);
                        setEditColumn(null);
                      }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">Edit Column</h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={colTitle}
                          onChange={e => setColTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={colDesc}
                          onChange={e => setColDesc(e.target.value)}
                          rows={2}
                          placeholder="Optional description..."
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          type="button"
                          onClick={() => setEditColumn(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  )}
                </Modal>

                {/* Add/Edit Task Modal */}
                <Modal
                  open={showTaskModal && showTaskModal.columnId === column.id}
                  onClose={() => {
                    setShowTaskModal(null);
                    setEditTask(null);
                    setTaskErrors({});
                  }}
                >
                  <form
                    onSubmit={e => {
                      e.preventDefault();

                      // Validate due date
                      const newErrors = {};
                      if (taskDueDate && !validateTaskDueDate(taskDueDate)) {
                        newErrors.dueDate = `Task due date cannot be after project due date (${workFlow?.dueDate})`;
                      }

                      if (Object.keys(newErrors).length > 0) {
                        setTaskErrors(newErrors);
                        return;
                      }

                      setTaskErrors({});
                      if (editTask) {
                        onEditTask(column.id, editTask.task.id, taskTitle, taskDesc, taskPriority, taskDueDate || null);
                      } else {
                        onAddTask(column.id, taskTitle, taskDesc, null, taskPriority, taskDueDate || null);
                      }
                      setShowTaskModal(null);
                      setEditTask(null);
                    }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {editTask ? '✏️ Edit Task' : '➕ Add Task'}
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📝 Task Title
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                        required
                        placeholder="Enter task title..."
                        maxLength="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📄 Description
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={taskDesc}
                        onChange={e => setTaskDesc(e.target.value)}
                        rows={2}
                        placeholder="Add a description..."
                        maxLength="200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🎯 Priority
                      </label>
                      <select
                        value={taskPriority}
                        onChange={e => setTaskPriority(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Due Date
                      </label>
                      {workFlow?.dueDate && (
                        <p className="text-xs text-blue-600 mb-1 bg-blue-50 p-1.5 rounded text-center">
                          ℹ️ Must be before: <strong>{workFlow.dueDate}</strong>
                        </p>
                      )}
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={e => {
                          setTaskDueDate(e.target.value);
                          if (taskErrors.dueDate) {
                            setTaskErrors(prev => ({ ...prev, dueDate: null }));
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                        max={getMaxTaskDueDate()}
                      />
                      {taskErrors.dueDate && (
                        <p className="text-red-500 text-xs mt-1 bg-red-50 p-1.5 rounded">
                          ⚠️ {taskErrors.dueDate}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 mt-4 border-t border-gray-200">
                      <button
                        className="flex-1 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        type="button"
                        onClick={() => {
                          setShowTaskModal(null);
                          setEditTask(null);
                          setTaskErrors({});
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 px-3 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        type="submit"
                      >
                        {editTask ? '💾 Save' : '➕ Add'}
                      </button>
                    </div>
                  </form>
                </Modal>
              </div>
            );
          })}
        </div>
      </div>
    );
  }