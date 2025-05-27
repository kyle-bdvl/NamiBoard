export default function Header({ workFlow, userProfile }) {
  const { firstName, lastName } = userProfile;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        {workFlow && (
          <div>
            <h2 className="text-2xl font-bold">{workFlow.title}</h2>
            {workFlow.objective && (
              <p className="mt-1 text-sm text-gray-500">
                {workFlow.objective}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div className="text-gray-800">
          {firstName} {lastName}
        </div>
      </div>
    </header>
  );
}