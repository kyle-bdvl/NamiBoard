import { useRef,useState } from 'react';

export default function CreateTask({ columnId, onAddTask }) {
  const titleRef = useRef();
  const descRef = useRef();
  const [file, setFile] = useState(null);

  function handleAdd() {
    const title = titleRef.current.value.trim();
    const description = descRef.current.value.trim();

    if (title === '') {
      alert("Please enter your title");
      return;
    }


    onAddTask(columnId, title, description, file); // Send task text + column ID to parent
    titleRef.current.value = '';
    descRef.current.value = '';
    setFile(null);
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
        className="text-sm p-2 rounded w-full"
        rows={2}
      />
      <button onClick={handleAdd} className="text-xs bg-blue-600 text-white px-2 py-1 rounded w-full">
        Add Task
      </button>
    </div>
  );
}
