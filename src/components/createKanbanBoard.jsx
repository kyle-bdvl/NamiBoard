import { useRef } from 'react';
import Input from './Input.jsx';
import Button from './Buttons.jsx';

export default function CreateKanbanBoard({ onAdd, onCancel }) {
  const title = useRef();
  const objective = useRef();
  const dueDate = useRef();

  function handleSave() {
    const enteredTitle = title.current.value;
    const enteredObjective = objective.current.value;
    const enteredDueDate = dueDate.current.value;

    onAdd({
      title: enteredTitle,
      objective: enteredObjective,
      dueDate: enteredDueDate
    });
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Kanban Board</h2>

      <div className="space-y-4">
        <Input type="text" ref={title} label="Title" />
        <Input textarea ref={objective} label="Objective" />
        <Input type="date" ref={dueDate} label="Due Date" />
      </div>

      <menu className="flex justify-end gap-4 mt-8">
        <li>
          <Button onClick={handleSave} row={true}>
            Save
          </Button>
        </li>
        <li>
          <Button onClick={onCancel} row={true}>
            Cancel
          </Button>
        </li>
      </menu>
    </div>
  );
}
