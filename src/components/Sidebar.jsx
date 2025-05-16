export default function Sidebar({ startWorkFlow, workFlows, onSelectKanban }) {
  const anchorClass = "block mb-4 text-gray-800 text-base no-underline";
  return (
    <aside className="w-[250px] bg-white p-5 border-r border-gray-200 flex flex-col items-start">
      <div className="mb-8 flex flex-row gap-2 items-center">
        <h2 className="text-2xl font-bold">NamiBoard </h2>
        <img src="../src/assets/waveLogo.webp" alt="waveLogo" className="w-6 h-6" />
      </div>
      <h2 className="text-2xl">Your WorkFlows</h2>
      <div>
        <button className="mt-2" onClick={startWorkFlow}>Add WorkFlow</button>
      </div>
      <ul className="mt-5 bg-stone-200 rounded-md flex flex-col px-2 py-2">
        {workFlows.map((work) => {
          return (
            <li key={work.id} className="mt-2">
              <button onClick={() => { onSelectKanban(work.id) }}>{work.title}</button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}