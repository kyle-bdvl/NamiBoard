export default function Header({ workFlow, userProfile }) {
  const { firstName, lastName } = userProfile;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  return (
    <header className="flex items-center justify-between mb-6 p-4 rounded-lg shadow-lg bg-gradient-to-br from-blue-100 to-blue-50">
      <div>
        {workFlow && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900">{workFlow.title}</h2>
            {workFlow.objective && (
              <p className="mt-1 text-sm text-gray-500">
                {workFlow.objective}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl shadow-md">
          {initials}
        </div>
        <div className="text-gray-800 font-medium text-lg">
          {firstName} {lastName}
        </div>
      </div>
    </header>
  );
}