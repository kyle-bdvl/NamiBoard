import { useState, useEffect } from 'react';

export default function Header({ workFlow, theme }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userProfile'));
        if (!storedUser?.email) {
          setUserData(null);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/user/${storedUser.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      }
    };

    // Initial fetch
    fetchUserData();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchUserData, 30000); // Update every 30 seconds

    // Listen for storage events (logout/login)
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        fetchUserData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array as we want this to run once and handle updates internally

  // Loading state
  if (!userData) {
    return (
      <header className="flex items-center justify-between mb-6 p-4 rounded-lg shadow-lg bg-gray-100">
        <div className="animate-pulse flex justify-between w-full">
          <div className="flex-1">
            {workFlow && (
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </header>
    );
  }

  const { firstName, lastName } = userData;
  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  let gradientClass = {
    "bg-blue-900": "bg-gradient-to-br from-blue-100 to-blue-50",
    "bg-green-900": "bg-gradient-to-br from-green-100 to-green-50",
    "bg-purple-900": "bg-gradient-to-br from-purple-100 to-purple-50",
    "bg-red-900": "bg-gradient-to-br from-red-100 to-red-50",
    "bg-yellow-900": "bg-gradient-to-br from-yellow-100 to-yellow-50",
    "bg-indigo-900": "bg-gradient-to-br from-indigo-100 to-indigo-50",
    "bg-gray-900": "bg-gradient-to-br from-gray-100 to-gray-50"
  }[theme.title] || "bg-gradient-to-br from-blue-100 to-blue-50";

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
                <strong>Objective:</strong> {workFlow.objective}
              </p>
            )}
            <div className="mt-2 flex flex-col items-center space-x-4 text-sm text-gray-600">
              <p className="mt-1 text-sm text-gray-500 flex flex-row items-center gap-2">
                <img className="w-6 h-6" src="../src/assets/calendar-range.svg" alt="calendar" />
                <strong>Due Date:</strong> {workFlow.dueDate}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className={`${theme.title} w-12 h-12 text-white rounded-full flex items-center justify-center font-semibold text-xl shadow-md`}>
          {initials}
        </div>
        <div className="text-gray-800 font-medium text-lg">
          {firstName} {lastName}
        </div>
      </div>
    </header>
  );
}