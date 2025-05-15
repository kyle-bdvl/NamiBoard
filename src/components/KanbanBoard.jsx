export default function KanbanBoard(){
  const userCircle = "w-[35px] h-[35px] bg-gray-200 rounded-full flex items-center justify-center font-bold";
  const buttonStyle ="bg-indigo-600 text-white px-4 py-2 border-none rounded-lg cursor-pointer"
  // To handle the Create card 
  function handleCreateCard(){
    
  }
  
  return(
     <main className="flex flex-col flex-grow p-5">
            <div className="flex items-center justify-between mb-5 ">
                <h1>Projects</h1>
                <input type="text" placeholder="Search..." className="w-[300px] px-3 py-2 border border-gray-300 rounded-lg"/>
                <button className={buttonStyle} onClick={handleCreateCard}>+ Create</button>
                <div className="flex flex-row gap-6">
                    <div className={userCircle}>Sa</div>
                    <div className={userCircle}>Sa</div>
                </div>
            </div>

    </main>
  );
}