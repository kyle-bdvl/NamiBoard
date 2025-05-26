import Button from './Buttons';

export default function Sidebar({ startWorkFlow, workFlows, onSelectKanban }) {
  return (
    <aside className="w-[260px] bg-blue-100 p-6 border-r border-gray-300 flex flex-col gap-6 shadow-md">
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <img src="../src/assets/waveLogo.webp" alt="waveLogo" className="w-7 h-7" />
        <h2 className="text-2xl font-bold text-gray-800">NamiBoard</h2>
      </div>

      {/* Add Workflow Button */}
      <div>
        <Button row={true} onClick={startWorkFlow}>
          Add WorkFlow
          <img className="w-4 h-4 ml-2" src="../src/assets/addIcon.png" alt="AddButton" />
        </Button>
      </div>

      {/* Workflow List */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Workflows</h3>
        {workFlows.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No workflows yet.</p>
        ) : (
          <ul className="space-y-2 bg-white rounded-lg p-3 shadow-inner">
            {workFlows.map((work) => (
              <li key={work.id}>
                <Button
                  row={true}
                  onClick={() => onSelectKanban(work.id)}
                  className="w-full justify-start bg-white text-gray-800 hover:bg-blue-200"
                >
                  {work.title}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
