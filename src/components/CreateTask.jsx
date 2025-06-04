import { useRef, useState } from 'react';

export default function CreateTask({ columnId, onAddTask }) {
  const titleRef = useRef();
  const descRef = useRef();
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState('Medium');  // new state for priority

  function handleAdd() {
    const title = titleRef.current.value.trim();
    const description = descRef.current.value.trim();

    if (title === '') {
      alert("Please enter your title");
      return;
    }

    // Pass priority as an additional argument.
    onAddTask(columnId, title, description, file, priority);
    titleRef.current.value = '';
    descRef.current.value = '';
    setFile(null);
    setPriority('Medium');
  }

  return (
    <div>
      <input
        ref={titleRef}
        type="text"
        placeholder="Task Title"
        className="text-sm p-1 rounded w-full mb-1"
      />
      <textarea
        ref={descRef}
        placeholder="Description"
        className="text-sm p-2 rounded w-full mb-1"
        rows={2}
      />
      {/* New Priority Selection */}
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="text-sm p-1 rounded w-full mb-1 border border-gray-300"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        onClick={handleAdd}
        className="text-xs bg-blue-600 text-white px-2 py-1 rounded w-full"
      >
        Add Task
      </button>
    </div>
  );
}
