import Input from "./Input";
import { useRef } from 'react';

export default function CreateColumn({ onAdd, done }) {
  const columnTitle = useRef();

  function handleColumnTitle() {
    const enteredTitle = columnTitle.current.value;
    if (enteredTitle.trim() === '') {
      alert("Please insert a value");
      return;
    }
    onAdd({ title: enteredTitle });
    done();
  }

  return (
    <div className="w-full max-w-sm p-4 bg-white rounded-md shadow-md">
      <Input label={"Column Name"} ref={columnTitle} />
      <button
        onClick={handleColumnTitle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Done
      </button>
    </div>
  );
}
