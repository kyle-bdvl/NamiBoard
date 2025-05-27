export default function NoBoardSelected({ startWorkFlow }) {
  return (
    <div className=" flex flex-col items-center justify-center p-8 gap-4 bg-white max-w-md mx-auto text-center">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/565/565547.png" 
        alt="No Project Selected" 
        className="w-24 h-24 opacity-60 mx-auto"
      />
      <h2 className="text-2xl font-semibold text-gray-800">No Project Selected</h2>
      <p className="text-gray-600 text-base">
        Select a project or get started with a new Workflow
      </p>
      <button 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
        onClick={startWorkFlow}
      >
        Create New Project
      </button>
    </div>
  );
}
