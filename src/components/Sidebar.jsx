import Button from './Buttons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ startWorkFlow, workFlows, onSelectKanban ,onLogout}) {
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [aboutUsClicked, setAboutUsClicked] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from App.jsx
    navigate('/login');
  };

  const handleAddWorkflow = () => {
    navigate('/'); // Ensure main board route
    startWorkFlow(); // Then start workflow logic
  };

  const handleSettingsClick = () => {
    if (settingsClicked) {
      // If already open, close settings and return to home board
      setSettingsClicked(false);
      navigate('/');
    } else {
      // Open settings page
      setSettingsClicked(true);
      navigate('/settings');
    }
  };

  const handleAboutUsClick = () => {
    if (aboutUsClicked) {
      // If already open, close About Us and return to home board
      setAboutUsClicked(false);
      navigate('/');
    } else {
      // Open About Us page
      setAboutUsClicked(true);
      navigate('/aboutUs');
    }
  };

  return (
    <aside
      className="w-[260px] bg-blue-100 p-6 border-r border-gray-300 flex flex-col justify-between h-screen"
      style={{
        boxShadow:
          '6px 0 15px -3px rgba(0, 0, 0, 0.2), 3px 0 8px -4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Top */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex items-center gap-3">
          <img
            src="../src/assets/waveLogo.webp"
            alt="waveLogo"
            className="w-8 h-8"
          />
          <h2 className="text-2xl font-bold text-blue-900">NamiBoard</h2>
        </div>

        {/* Add Workflow Button */}
        <div>
          <Button row={true} onClick={handleAddWorkflow}>
            Add WorkFlow
            <img
              className="w-4 h-4 ml-2"
              src="../src/assets/addIcon.png"
              alt="AddButton"
            />
          </Button>
        </div>

        {/* Workflow List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Your Workflows
          </h3>
          {workFlows.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No workflows yet.</p>
          ) : (
            <ul className="space-y-2 bg-white rounded-lg p-3 shadow-inner">
              {workFlows.map((work) => (
                <li key={work.id}>
                  <Button
                    row={true}
                    onClick={() => {
                      onSelectKanban(work.id);
                      navigate('/'); // Navigate to main board immediately
                    }}
                    className="w-full justify-start bg-white text-gray-800 hover:bg-blue-200"
                  >
                    {work.title}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Utility Links */}
      <div className="mt-6 border-t border-gray-300 pt-4 space-y-2 text-[15px] text-gray-700">
        <button
          onClick={handleAboutUsClick}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-200 hover:text-blue-800 transition-all"
        >
          <img
            src="../src/assets/help-box-outline.svg"
            className="w-5 h-5"
            alt="Help"
          />
          About Us
        </button>
        <button className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-200 hover:text-blue-800 transition-all">
          <img src="../src/assets/FAQ.svg" className="w-5 h-5" alt="FAQ" />
          FAQ
        </button>
        <button
          onClick={handleSettingsClick}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-200 hover:text-blue-800 transition-all"
        >
          <img src="../src/assets/cog.svg" className="w-5 h-5" alt="Settings" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <img src="../src/assets/logout.svg" className="w-5 h-5" alt="Logout" />
          Logout
        </button>
      </div>
    </aside>
  );
}
