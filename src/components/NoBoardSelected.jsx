export default function NoBoardSelected({startWorkFlow}){
  return ( 
    <div className=" mt-2 flex flex-col p-5 gap-2">
      <img src="" alt="" />
      <h2>No Project Selected</h2>
      <p className="">Select a project or get started with a new Workflow</p>
      <p>
        <button className="mt-2 bg-blue-400 py-2 px-5 rounded-md hover:cursor-pointer hover:bg-blue-600" onClick={startWorkFlow}>Create New Project</button>
      </p>
    </div>
  )
}