export default function Header({ workFlow, userProfile, theme }) {
  const { firstName, lastName } = userProfile;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  //fopr
  let gradientClass = "";
  if (theme.title === "bg-blue-900") {
    gradientClass = "bg-gradient-to-br from-blue-100 to-blue-50";
  } else if (theme.title === "bg-green-900") {
    gradientClass = "bg-gradient-to-br from-green-100 to-green-50";
  } else if (theme.title === "bg-purple-900") {
    gradientClass = "bg-gradient-to-br from-purple-100 to-purple-50";
  } else if (theme.title === "bg-red-900") {
    gradientClass = "bg-gradient-to-br from-red-100 to-red-50";
  } else if (theme.title === "bg-yellow-900") {
    gradientClass = "bg-gradient-to-br from-yellow-100 to-yellow-50";
  } else if (theme.title === "bg-indigo-900") {
    gradientClass = "bg-gradient-to-br from-indigo-100 to-indigo-50";
  } else if (theme.title === "bg-gray-900") {
    gradientClass = "bg-gradient-to-br from-gray-100 to-gray-50";
  } else {
    gradientClass = "bg-gradient-to-br from-blue-100 to-blue-50";
  }
  console.log(theme.title)
  return (
    <header
      className={`flex items-center justify-between mb-6 p-4 rounded-lg shadow-lg ${gradientClass}`}
    >
      <div>
        {workFlow && (
          <div className="flex flex-col items-start">
            <h2 className="text-2xl mb-3 font-bold flex flex-row items-center gap-4 text-black">
              {workFlow.title} 
              
            </h2>
            {workFlow.objective && (
              <p className="mt-1 text-sm text-gray-500 flex flex-row items-center gap-2">
                <img className="w-6 h-6" src="../src/assets/objective.svg" alt="target-objective" />
                <strong> Objective :</strong> {workFlow.objective}
              </p>
            )}
            <div className="mt-2 flex flex-col items-center space-x-4 text-sm text-gray-600">
              <p className="mt-1 text-sm text-gray-500 flex flex-row items-center gap-2">
                <img className="w-6 h-6" src="../src/assets/calendar-range.svg" alt="calendar" /> 
                <strong>Due Date :</strong> {workFlow.dueDate}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className={`${theme.title} w-12 h-12  text-white rounded-full flex items-center justify-center font-semibold text-xl shadow-md`}>
          {initials}
        </div>
        <div className="text-gray-800 font-medium text-lg">
          {firstName} {lastName}
        </div>
      </div>
    </header>
  );
}