export default function Header({ workFlow }) {
  const userCircle =
    "w-12 h-12 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-semibold shadow-sm";

  return (
    <header className="flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow rounded-md mb-5">
      {/* Title and Objective Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-800">
          {workFlow.title || "Untitled Board"}
        </h1>
        <p className="text-sm text-gray-600 max-w-md">
          <span className="font-semibold">Objective:</span>{" "}
          {workFlow.objective || "No objective set."}
        </p>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <div className={userCircle}>MP</div>
        <span className="text-sm text-gray-700">Molly Potter</span>
      </div>
    </header>
  );
}
