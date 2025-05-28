export default function NoBoardSelected({ startWorkFlow }) {
  return (
    <div className=" flex flex-col items-center justify-center p-8 gap-4 bg-slate-100 max-w-md mx-auto text-center">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/565/565547.png" 
        alt="No Project Selected" 
        className="w-24 h-24 opacity-60 mx-auto"
      />
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md">
  <h2 className="text-3xl font-bold text-gray-800 mb-2">No Project Selected</h2>
  <p className="text-gray-600 text-center text-base mb-4">
    Please select a project or start a new workflow to begin.
  </p>
  <button 
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow transition duration-300"
    onClick={startWorkFlow}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
    Create New Project
  </button>
</div>

    </div>
  );
}
