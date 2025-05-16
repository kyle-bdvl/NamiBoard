export default function Columns({ columns }) {

  return (
    <div className="mt-10">
      <ul className="flex flex-row gap-5">
        {columns.map((column) => (
          <li key={column.id} className="bg-amber-500">
            <h3>{column.title}</h3> 
            <button>Add Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}