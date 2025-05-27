import React, { useState } from "react";
import Modal from "./Modal";

export default function Task({ task, columnId, onDelete, onEdit, onAddFile }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editTitle, editDescription);  // Remove columnId and taskId since they're handled in the parent
    setShowEditModal(false);
  };

  return (
    <li className="bg-white p-3 rounded shadow text-sm space-y-2 ">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-base flex-1 break-all">{task.title}</h4>
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
        <button
          className="block w-full text-left py-2 hover:bg-gray-100"
          onClick={() => {
            setShowTaskModal(false);
            setEditTitle(task.title);
            setEditDescription(task.description || "");
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
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
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
      </Modal>

      {/* File upload modal */}
      <Modal open={showFileModal} onClose={() => setShowFileModal(false)}>
        <div>
          <input
            type="file"
            onChange={e => {
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