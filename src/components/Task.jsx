import React, { useState } from "react";
import Modal from "./Modal";

export default function Task({ task, columnId, onDelete, onEdit, onAddFile, onComplete }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState(task.priority || "Medium");

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editTitle, editDescription, editPriority);
    setShowEditModal(false);
  };

  return (
    <li className="bg-white p-4 rounded-md shadow border border-gray-200 text-sm space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1">
          {/* Check button to mark complete */}
          <button
            onClick={() => onComplete(task.id)}
            className={`w-6 h-6 flex-shrink-0 rounded-full border ${
              task.completed ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
            }`}
            title="Mark as complete"
          >
            {task.completed && (
              <span className="text-white text-xs flex items-center justify-center">&#10003;</span>
            )}
          </button>
          <h4 className="font-semibold text-base break-all">{task.title}</h4>
          {/* Priority badge */}
          {task.priority && (
            <span className="ml-2 text-xs font-medium px-1 py-0.5 rounded bg-yellow-100 text-yellow-800">
              {task.priority}
            </span>
          )}
        </div>
        <button
          className="text-lg px-2"
          onClick={() => setShowTaskModal(true)}
          aria-label="Task options"
        >
          ...
        </button>
      </div>
      {task.description && (
        <p className="break-all text-xs text-gray-700">{task.description}</p>
      )}
      {task.file && (
        <div className="mt-1">
          {task.file.type && task.file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(task.file)}
              alt="task attachment"
              className="w-full h-32 object-cover rounded"
            />
          ) : (
            <a
              href={URL.createObjectURL(task.file)}
              download={task.file.name}
              className="text-xs text-blue-600 underline"
            >
              Download {task.file.name}
            </a>
          )}
        </div>
      )}
      <button
        className="text-xs text-blue-600 underline"
        onClick={() => setShowFileModal(true)}
      >
        Insert File
      </button>

      {/* Task options modal */}
      <Modal open={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <div className="p-4 bg-white rounded-md shadow-md">
          <button
            className="block w-full text-left py-2 hover:bg-gray-100"
            onClick={() => {
              setShowTaskModal(false);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
              setEditPriority(task.priority || "Medium");
              setShowEditModal(true);
            }}
          >
            Edit Task
          </button>
          <button
            className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
            onClick={() => {
              onDelete();
              setShowTaskModal(false);
            }}
          >
            Delete Task
          </button>
        </div>
      </Modal>

      {/* Edit / Create Task Modal (integrated with priority) */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6 bg-white rounded-md shadow-md">
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  rows="3"
                />
              </div>
              {/* New Priority Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-1"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* File upload modal remains unchanged */}
      <Modal open={showFileModal} onClose={() => setShowFileModal(false)}>
        <div className="p-6 bg-white rounded-md shadow-md text-center">
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onAddFile(e.target.files[0]);
                setShowFileModal(false);
              }
            }}
          />
        </div>
      </Modal>
    </li>
  );
}