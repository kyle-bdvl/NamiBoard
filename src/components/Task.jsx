import React, { useState } from "react";
import Modal from "./Modal";

export default function Task({ task, onDelete, onEdit, onAddFile }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  return (
    <li className="bg-white p-3 rounded shadow text-sm space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-base flex-1">{task.title}</h4>
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
            onEdit();
            setShowTaskModal(false);
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