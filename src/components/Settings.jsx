import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings({ userProfile, setUserProfile, settingsClicked, setSettingsClicked, theme }) {
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local state
      setUserProfile({
        firstName,
        lastName,
        email
      });

      // Update localStorage if you're using it
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        firstName,
        lastName,
        email
      }));

      setShowModal(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    // Reset the settingsClicked state as well on cancel
    setSettingsClicked(false);
    // Optionally, reset form fields to userProfile values if desired
    navigate('/'); // Navigate to the main board route
  };

  const goToCreateBoard = () => {
    // Close modal and navigate to create Kanban Board page (here assumed as "/")
    setSettingsClicked(settingsClicked => !settingsClicked);
    setShowModal(false);
    navigate('/');
  };

  // changing the theme color for the inputs 
  let focusBorder = '';
  if (theme.title === 'bg-blue-900') {
    focusBorder = 'focus:ring-blue-600';
  } else if (theme.title === 'bg-green-900') {
    focusBorder = 'focus:ring-green-600';
  } else if (theme.title === 'bg-purple-900') {
    focusBorder = 'focus:ring-purple-600';
  } else if (theme.title === 'bg-red-900') {
    focusBorder = 'focus:ring-red-600';
  } else if (theme.title === 'bg-yellow-900') {
    focusBorder = 'focus:ring-yellow-600';
  } else if (theme.title === 'bg-indigo-900') {
    focusBorder = 'focus:ring-indigo-600';
  } else if (theme.title === 'bg-gray-900') {
    focusBorder = 'focus:ring-gray-600';
  } else {
    focusBorder = 'focus:ring-blue-600';
  }

  // Changing the color for hovering on the button  
  let hoverClasses ='';
  if (theme.title === 'bg-blue-900') {
    hoverClasses = 'bg-blue-500 hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-green-900') {
    hoverClasses = 'bg-green-500 hover:bg-green-700 hover:text-white hover:ring-2 hover:ring-green-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-purple-900') {
    hoverClasses = 'bg-purple-500 hover:bg-purple-700 hover:text-white hover:ring-2 hover:ring-purple-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-red-900') {
    hoverClasses = 'bg-red-500 hover:bg-red-700 hover:text-white hover:ring-2 hover:ring-red-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-yellow-900') {
    hoverClasses = 'bg-yellow-500 hover:bg-yellow-700 hover:text-white hover:ring-2 hover:ring-yellow-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-indigo-900') {
    hoverClasses = 'bg-indigo-500 hover:bg-indigo-700 hover:text-white hover:ring-2 hover:ring-indigo-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-gray-900') {
    hoverClasses = 'bg-gray-500 hover:bg-gray-700 hover:text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2';
  } else {
    hoverClasses = 'bg-gray-500 hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  }

  // New variable to change text color based on theme
  let themeTextColor = '';
  if (theme.title === 'bg-blue-900') {
    themeTextColor = 'text-blue-800';
  } else if (theme.title === 'bg-green-900') {
    themeTextColor = 'text-green-800';
  } else if (theme.title === 'bg-purple-900') {
    themeTextColor = 'text-purple-800';
  } else if (theme.title === 'bg-red-900') {
    themeTextColor = 'text-red-800';
  } else if (theme.title === 'bg-yellow-900') {
    themeTextColor = 'text-yellow-800';
  } else if (theme.title === 'bg-indigo-900') {
    themeTextColor = 'text-indigo-800';
  } else if (theme.title === 'bg-gray-900') {
    themeTextColor = 'text-gray-800';
  } else {
    themeTextColor = 'text-blue-800';
  }
  
  // New variables to change Profile Summary background and border based on theme
  let profileBg = '';
  let profileBorder = '';
  if (theme.title === 'bg-blue-900') {
    profileBg = 'bg-blue-50';
    profileBorder = 'border-blue-200';
  } else if (theme.title === 'bg-green-900') {
    profileBg = 'bg-green-50';
    profileBorder = 'border-green-200';
  } else if (theme.title === 'bg-purple-900') {
    profileBg = 'bg-purple-50';
    profileBorder = 'border-purple-200';
  } else if (theme.title === 'bg-red-900') {
    profileBg = 'bg-red-50';
    profileBorder = 'border-red-200';
  } else if (theme.title === 'bg-yellow-900') {
    profileBg = 'bg-yellow-50';
    profileBorder = 'border-yellow-200';
  } else if (theme.title === 'bg-indigo-900') {
    profileBg = 'bg-indigo-50';
    profileBorder = 'border-indigo-200';
  } else if (theme.title === 'bg-gray-900') {
    profileBg = 'bg-gray-50';
    profileBorder = 'border-gray-200';
  } else {
    profileBg = 'bg-blue-50';
    profileBorder = 'border-blue-200';
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8 relative">
      {/* Add error message display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Page Title */}
        <h1 className={`text-4xl font-extrabold ${themeTextColor} mb-6 border-b-2 ${themeTextColor} pb-2`}>
          Settings
        </h1>

        {/* Profile Summary */}
        <section className={`mb-6 ${profileBg} p-4 rounded-md border ${profileBorder}`}>
          <h2 className={`text-xl font-bold ${themeTextColor} mb-2`}>Profile Summary</h2>
          <p className="text-gray-700">
            Hello, {firstName} {lastName}. Your registered email is {email}.
          </p>
        </section>

        {/* Profile Section with First Name, Last Name, Email */}
        <section className="mb-6">
          <h2 className={`text-xl font-semibold ${themeTextColor} mb-2`}>Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className={`mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${focusBorder}`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                className={`mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${focusBorder}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${focusBorder}`}
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="mb-6">
          <h2 className={`text-xl font-semibold ${themeTextColor} mb-2`}>Preferences</h2>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="notifications" className="w-4 h-4" />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Enable email notifications
            </label>
          </div>
        </section>

        {/* Tips & Help */}
        <section className="mb-6 bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h2 className={`text-xl font-bold ${themeTextColor} mb-2`}>Tips & Help</h2>
          <p className="text-gray-700">
            Need assistance? Check out our FAQ or contact support for help.
          </p>
        </section>

        {/* Save & Cancel Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            className={`${hoverClasses} text-white px-6 py-2 rounded-lg transition`}
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">
              Your changes have been saved.
            </p>
            <button
              onClick={goToCreateBoard}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Kanban Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
