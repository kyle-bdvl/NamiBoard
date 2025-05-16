export default function Header({workFlow}){
    const userCircle = "w-[35px] h-[35px] bg-gray-200 rounded-full flex items-center justify-center font-bold";

  return (
    <div className="flex items-center justify-between mb-5 ">
        <h1>{workFlow.title}</h1>
        <input type="text" placeholder="Search..." className="w-[300px] px-3 py-2 border border-gray-300 rounded-lg" />
        
        <div className="flex flex-row gap-6">
          <div className={userCircle}>Molly Potter</div>
        </div>
       
      </div>
  );
}