import React, { useState } from "react";
import Modal from "./Modal";

export default function Task({ task, columnId, workFlow, onDelete, onEdit, onAddFile, onCompleteTask }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editErrors, setEditErrors] = useState({});

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate due date against workflow due date
    const newErrors = {};
    if (editDueDate && workFlow?.dueDate) {
      const taskDate = new Date(editDueDate);
      const workflowDate = new Date(workFlow.dueDate);
      
      if (taskDate > workflowDate) {
        newErrors.dueDate = `Task due date cannot be after project due date (${workFlow.dueDate})`;
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          dueDate: editDueDate || null
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }

      setEditErrors({});
      onEdit(editTitle, editDescription, editPriority, editDueDate || null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task: ' + error.message);
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-l-4 border-red-500';
      case 'medium': return 'bg-yellow-100 border-l-4 border-yellow-500';
      case 'low': return 'bg-green-100 border-l-4 border-green-500';
      default: return 'bg-gray-100 border-l-4 border-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Get days until due
  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <li className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 space-y-3 border ${getPriorityColor(task.priority)} ${isOverdue() ? 'ring-2 ring-red-300' : ''} ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Completion Checkbox */}
            <button
              onClick={() => onCompleteTask && onCompleteTask(columnId, task.id, !task.completed)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {task.completed && <span className="text-xs">✓</span>}
            </button>
            
            <span className="text-sm">{getPriorityIcon(task.priority)}</span>
            <h4 className={`font-semibold text-base flex-1 break-all text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h4>
            <button
              className="text-gray-400 hover:text-gray-600 text-lg px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                console.log("Opening task options modal");
                setShowTaskModal(true);
              }}
              aria-label="Task options"
            >
              ⋯
            </button>
          </div>
          
          {task.description && (
            <p className={`break-all text-sm leading-relaxed mb-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          {/* Due date display */}
          {task.dueDate && (
            <div className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
              task.completed
                ? 'bg-gray-100 text-gray-500'
                : isOverdue() 
                ? 'bg-red-100 text-red-700' 
                : daysUntilDue <= 3 
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
            }`}>
              {task.completed 
                ? '✅ Completed'
                : isOverdue() 
                ? `⚠️ Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                : daysUntilDue === 0
                  ? '🎯 Due today'
                  : daysUntilDue === 1
                    ? '📅 Due tomorrow'
                    : `📅 Due in ${daysUntilDue} days`
              }
            </div>
          )}
          
          {/* Priority badge */}
          <div className={`text-xs px-2 py-1 rounded-full inline-block mr-2 ${
            task.completed
              ? 'bg-gray-100 text-gray-500'
              : task.priority === 'high' ? 'bg-red-200 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
          }`}>
            {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'} Priority
          </div>
        </div>
      </div>

      {/* File attachment display */}
      {task.file && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          {task.file.type && task.file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(task.file)}
              alt="task attachment"
              className="w-full h-32 object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📎</span>
              <a
                href={URL.createObjectURL(task.file)}
                download={task.file.name}
                className="text-sm text-blue-600 hover:text-blue-800 underline flex-1 truncate"
              >
                {task.file.name}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
          onClick={() => setShowFileModal(true)}
        >
          📎 Add File
        </button>
      </div>

      {/* Task options modal */}
      <Modal open={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <div className="space-y">
          <button
            className="block w-full text-left py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => {
              setShowTaskModal(false);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
              setEditPriority(task.priority || 'medium');
              setEditDueDate(task.dueDate || '');
              setShowEditModal(true);
            }}
          >
            ✏️ Edit Task
          </button>
          <button
            className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            onClick={async () => {
              try {
                await onDelete();  // This will trigger handleDeleteTask in App.jsx
                setShowTaskModal(false);
              } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
              }
            }}
          >
            🗑️ Delete Task
          </button>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Task</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Add a description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
                {workFlow?.dueDate && (
                  <span className="text-xs text-gray-500 block">
                    (Must be on or before {workFlow.dueDate})
                  </span>
                )}
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => {
                  setEditDueDate(e.target.value);
                  // Clear error when user changes date
                  if (editErrors.dueDate) {
                    setEditErrors(prev => ({ ...prev, dueDate: null }));
                  }
                }}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                max={workFlow?.dueDate || undefined}
              />
              {editErrors.dueDate && (
                <p className="text-red-500 text-xs mt-1">⚠️ {editErrors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* File upload modal */}
      <Modal open={showFileModal} onClose={() => setShowFileModal(false)}>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add File to Task</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <input
              type="file"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  onAddFile(e.target.files[0]);
                  setShowFileModal(false);
                }
              }}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Choose any file type to attach to this task
            </p>
          </div>
        </div>
      </Modal>
    </li>
  );
}