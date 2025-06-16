import { useRef , useState} from 'react';
import Input from './Input.jsx';
import Button from './Buttons.jsx';

export default function CreateKanbanBoard({ onAdd, onCancel, theme }) {
  const title = useRef();
  const objective = useRef();
  const dueDate = useRef();
  const [errors, setErrors] = useState({});



  const validateForm = () => {
    const newErrors = {};
    const enteredTitle = title.current.value.trim();
    const enteredObjective = objective.current.value.trim();
    const enteredDueDate = dueDate.current.value;

    if (!enteredTitle) {
      newErrors.title = "Project title is required";
    }

    if (!enteredObjective) {
      newErrors.objective = "Project objective is required";
    }

    if (!enteredDueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(enteredDueDate) <= new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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


  function handleSave(e) {  // Add event parameter
    e.preventDefault();  // Prevent form submission
    
    try {
      const enteredTitle = title.current.value;
      const enteredObjective = objective.current.value;
      const enteredDueDate = dueDate.current.value;

      if (validateForm()) {  // Use the validation function
        onAdd({
          title: enteredTitle,
          objective: enteredObjective,
          dueDate: enteredDueDate
        });
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to create workflow. Please try again.');
    }
  }

  return (
    <div className={`max-w-2xl mx-auto mt-10 p-8 rounded-2xl bg-white shadow-md border-1`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Kanban Board</h2>

      <form className="space-y-4">
        <div>
          <Input theme={theme} type="text" ref={title} label="Title" required />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

        </div>
        <div>
          <Input theme={theme} textarea ref={objective} label="Objective" required />
          {errors.objective && <p className="text-red-500 text-sm mt-1">{errors.objective}</p>}

        </div>
        <div>
          <Input theme={theme} type="date" ref={dueDate} label="Due Date" required min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}

        </div>
      </form>

      <menu className="flex justify-end gap-4 mt-8">
        <li>
          <Button onClick={handleSave} type="submit" row={true} className={`${theme.sidebar} ${hoverClasses}`}>
            Save
          </Button>
        </li>
        <li>
          <Button onClick={onCancel} type="button" row={true} className={`${theme.sidebar} ${hoverClasses}`}>
            Cancel
          </Button>
        </li>
      </menu>
    </div>
  );
}
