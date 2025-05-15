export default function Sidebar(){
  const anchorClass = "block mb-4 text-gray-800 text-base no-underline";
  return (    
        <aside className="w-[250px] bg-white p-5 border-r border-gray-200">
            <h2 className="mb-8 text-2xl font-bold">NamiBoard</h2>
            <nav class="nav">
                <a href="#" className={anchorClass}>Boards</a>
                <a href="#" className={anchorClass}>My Task</a>
                <a href="#" className={anchorClass}>Leads</a>
                <a href="#" className={anchorClass}>Documents</a>
                <a href="#" className={anchorClass}>Clients</a>
                <div className="mx-5 "></div>
                <h4 className="mb-2 text-gray-800">Favorites</h4>
                <a href="#" className={anchorClass}>Space</a>
                <a href="#" className={anchorClass}>Team Space</a>
                <a href="#" className={anchorClass}>Projects</a>
                <a href="#" className={anchorClass}>Creative Redesign Hub</a>
            </nav>
        </aside>
  );
}