import React, { useState } from "react";
import Task from "./Task";
import Modal from "./Modal";

export default function Columns({
  columns,
  onAddTask,
  onDeleteColumn,
  onEditColumn,
  onDeleteTask,
  onEditTask,
  onAddTaskFile,
}) {
  const [showColumnModal, setShowColumnModal] = useState(null); // columnId or null
  const [editColumn, setEditColumn] = useState(null); // {id, title, description}
  const [showTaskModal, setShowTaskModal] = useState(null); // columnId or null
  const [editTask, setEditTask] = useState(null); // {columnId, task}
  
  // For editing column
  const [colTitle, setColTitle] = useState("");
  const [colDesc, setColDesc] = useState("");

  // For creating/editing task
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

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
    setShowTaskModal({ columnId, edit: true });
  }

  // Handle add task modal open
  function handleAddTaskModal(columnId) {
    setEditTask(null);
    setTaskTitle("");
    setTaskDesc("");
    setShowTaskModal({ columnId, edit: false });
  }

  return (
    <div className="mt-10">
      <ul className="flex flex-row gap-5">
        {columns.map((column) => (
          <li key={column.id} className={`${column.color || 'bg-blue-100'} p-3 rounded-md w-64`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold break-all">{column.title}</h3>
              <button
                className="text-lg px-2"
                onClick={() => setShowColumnModal(column.id)}
                aria-label="Column options"
              >
                ...
              </button>
            </div>
            <ul className="space-y-2 mb-3">
              {(column.tasks || []).map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  columnId={column.id}           // Add this prop
                  onDelete={() => onDeleteTask(column.id, task.id)}
                  onEdit={(title, description) => onEditTask(column.id, task.id, title, description)}
                  onAddFile={(file) => onAddTaskFile(column.id, task.id, file)}
                />
              ))}
            </ul>
            <button
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded w-full"
              onClick={() => handleAddTaskModal(column.id)}
            >
              Add Task
            </button>

            {/* Column Modal */}
            <Modal open={showColumnModal === column.id} onClose={() => setShowColumnModal(null)}>
              {!editColumn || editColumn.id !== column.id ? (
                <div>
                  <button
                    className="block w-full text-left py-2 hover:bg-gray-100"
                    onClick={() => handleEditColumnOpen(column)}
                  >
                    Edit Column
                  </button>
                  <button
                    className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      onDeleteColumn(column.id);
                      setShowColumnModal(null);
                    }}
                  >
                    Delete Column
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
                >
                  <div>
                    <label className="block text-xs mb-1">Title</label>
                    <input
                      className="w-full border rounded p-1 mb-2"
                      value={colTitle}
                      onChange={e => setColTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Description</label>
                    <textarea
                      className="w-full border rounded p-1 mb-2"
                      value={colDesc}
                      onChange={e => setColDesc(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2" type="submit">
                    Save
                  </button>
                  <button
                    className="text-gray-500 px-3 py-1 rounded"
                    type="button"
                    onClick={() => setEditColumn(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </Modal>

            {/* Add/Edit Task Modal */}
            <Modal
              open={showTaskModal && showTaskModal.columnId === column.id}
              onClose={() => {
                setShowTaskModal(null);
                setEditTask(null);
              }}
            >
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (editTask) {
                    onEditTask(column.id, editTask.task.id, taskTitle, taskDesc);
                  } else {
                    onAddTask(column.id, taskTitle, taskDesc, null);
                  }
                  setShowTaskModal(null);
                  setEditTask(null);
                }}
              >
                <div>
                  <label className="block text-xs mb-1">Task Title</label>
                  <input
                    className="w-full border rounded p-1 mb-2"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Description</label>
                  <textarea
                    className="w-full border rounded p-1 mb-2"
                    value={taskDesc}
                    onChange={e => setTaskDesc(e.target.value)}
                    rows={2}
                  />
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2" type="submit">
                  Done
                </button>
                <button
                  className="text-gray-500 px-3 py-1 rounded"
                  type="button"
                  onClick={() => {
                    setShowTaskModal(null);
                    setEditTask(null);
                  }}
                >
                  Cancel
                </button>
              </form>
            </Modal>
          </li>
        ))}
      </ul>
    </div>
  );
}