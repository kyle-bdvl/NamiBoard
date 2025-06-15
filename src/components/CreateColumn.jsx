import Input from "./Input";
import { useRef, useState } from 'react';

const COLUMN_COLORS = [
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-red-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
  'bg-gray-100',
];

export default function CreateColumn({ onAdd, done,theme }) {
  const columnTitle = useRef();
  const columnDesc = useRef();
  const [selectedColor, setSelectedColor] = useState(COLUMN_COLORS[0]);

  function handleColumnTitle() {
    const enteredTitle = columnTitle.current.value;
    const enteredDesc = columnDesc.current.value;
    if (enteredTitle.trim() === '') {
      alert("Please insert a value");
      return;
    }
    onAdd({ title: enteredTitle, description: enteredDesc, color: selectedColor });
    done();
  }

  return (
    <div className="w-full max-w-sm p-4 bg-white rounded-md shadow-md">
      <Input theme={theme} label={"Column Name"} ref={columnTitle} />
      <Input theme={theme} label={"Column Description"} ref={columnDesc} textarea={true} />
      <div className="mb-4">
        
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Column Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLUMN_COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full ${color} border-2 ${
                selectedColor === color ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleColumnTitle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Done
      </button>
    </div>
  );
}