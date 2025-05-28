import { useRef } from 'react';
import Input from './Input.jsx';
import Button from './Buttons.jsx';

export default function CreateKanbanBoard({ onAdd, onCancel , theme }) {
  const title = useRef();
  const objective = useRef();
  const dueDate = useRef();

 

   let hoverClasses = '';

  if (theme.title === 'bg-blue-900') {
    hoverClasses = 'hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-green-900') {
    hoverClasses = 'hover:bg-green-700 hover:text-white hover:ring-2 hover:ring-green-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-purple-900') {
    hoverClasses = 'hover:bg-purple-700 hover:text-white hover:ring-2 hover:ring-purple-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-red-900') {
    hoverClasses = 'hover:bg-red-700 hover:text-white hover:ring-2 hover:ring-red-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-yellow-900') {
    hoverClasses = 'hover:bg-yellow-700 hover:text-white hover:ring-2 hover:ring-yellow-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-indigo-900') {
    hoverClasses = 'hover:bg-indigo-700 hover:text-white hover:ring-2 hover:ring-indigo-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-gray-900') {
    hoverClasses = 'hover:bg-gray-700 hover:text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2';
  } else {
    hoverClasses = 'hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  }


  function handleSave(e) {
    e.preventDefault();
    const enteredTitle = title.current.value;
    const enteredObjective = objective.current.value;
    const enteredDueDate = dueDate.current.value;

    if (!enteredTitle.trim()===' ' || !enteredObjective.trim()=== ' ' || !enteredDueDate) {
      alert("All fields are required.");
      return;
    }
    if (new Date(enteredDueDate) < new Date()) {
      alert("Due date cannot be in the past.");
      return;
    }

   
    onAdd({
      title: enteredTitle,
      objective: enteredObjective,
      dueDate: enteredDueDate
    });
  }

  return (
    <div className={`max-w-2xl mx-auto mt-10 p-8 rounded-2xl bg-white shadow-md border-1`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Kanban Board</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <Input theme={theme} type="text" ref={title} label="Title" required />
        <Input theme={theme} textarea ref={objective} label="Objective" required />
        <Input theme={theme} type="date" ref={dueDate} label="Due Date" required />
      </form>

      <menu className="flex justify-end gap-4 mt-8">
        <li>
          <Button onClick={handleSave} row={true} className={`${theme.sidebar} ${hoverClasses}`}>
            Save
          </Button>
        </li>
        <li>
          <Button onClick={onCancel} row={true} className={`${theme.sidebar} ${hoverClasses}`}>
            Cancel
          </Button>
        </li>
      </menu>
    </div>
  );
}
