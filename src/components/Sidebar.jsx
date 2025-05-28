import Button from './Buttons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ThemeSettings from './ThemeSettings';

export default function Sidebar({
  startWorkFlow,
  workFlows,
  onSelectKanban,
  onSideBarToggle,
  onLogout,
  settingsClicked,
  setSettingsClicked,
  selectedWorkFlowId
}) {
  const [aboutUsClicked, setAboutUsClicked] = useState(false);
  const [logoAnimate, setLogoAnimate] = useState(false);
  const [theme, setTheme] = useState({ sidebar: 'bg-blue-200', title: 'bg-blue-900' });
  const navigate = useNavigate();

  // to be placed in the className for aboutUs, FAQ, and Settings buttons 


  const handleLogout = () => {
    setAboutUsClicked(false);
    setSettingsClicked(false);
    onLogout();
    navigate('/login');
  };

  const handleAddWorkflow = () => {
    setAboutUsClicked(false);
    setSettingsClicked(false);
    navigate('/');
    startWorkFlow();
  };

  const handleSettingsClick = () => {
    if (settingsClicked) {
      setAboutUsClicked(false);
      setSettingsClicked(false);
      onSelectKanban(null);  // clear workflow selection
      navigate('/');
    } else {
      setAboutUsClicked(false);
      setSettingsClicked(true);
      onSelectKanban(null);  // clear workflow selection
      navigate('/settings');
    }
  };

  const handleAboutUsClick = () => {
    if (aboutUsClicked) {
      setSettingsClicked(false);
      setAboutUsClicked(false);
      onSelectKanban(null);  // clear workflow selection
      navigate('/');
    } else {
      setSettingsClicked(false);
      setAboutUsClicked(true);
      onSelectKanban(null);  // clear workflow selection
      navigate('/aboutUs');
    }
  };

  const handleLogoDoubleClick = () => {
    setLogoAnimate(prev => !prev);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  let hoverClasses = '';

  if (theme.title === 'bg-blue-900') {
    hoverClasses = 'hover:bg-blue-900 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-green-900') {
    hoverClasses = 'hover:bg-green-900 hover:text-white hover:ring-2 hover:ring-green-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-purple-900') {
    hoverClasses = 'hover:bg-purple-900 hover:text-white hover:ring-2 hover:ring-purple-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-red-900') {
    hoverClasses = 'hover:bg-red-900 hover:text-white hover:ring-2 hover:ring-red-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-yellow-900') {
    hoverClasses = 'hover:bg-yellow-900 hover:text-white hover:ring-2 hover:ring-yellow-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-indigo-900') {
    hoverClasses = 'hover:bg-indigo-900 hover:text-white hover:ring-2 hover:ring-indigo-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-gray-900') {
    hoverClasses = 'hover:bg-gray-900 hover:text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2';
  } else {
    // Fallback classes
    hoverClasses = 'hover:bg-blue-900 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  }

  console.log(hoverClasses)

  return (
    <aside
      className={`w-72 ${theme.sidebar} CustomScrollbar overflow-y-scroll duration-500 flex flex-col justify-between`}
      style={{
        boxShadow:
          '6px 0 15px -3px rgba(0, 0, 0, 0.2), 3px 0 8px -4px rgba(0, 0, 0, 0.1)',
      }}>

      {/* Top */}
      <div className=" px-4 pt-4 flex flex-col gap-6 m-0">
        {/* Logo */}

        <div

          className="bg-blue-900 shadow-md rounded-lg p-4 flex items-center gap-3 cursor-pointer"

          onDoubleClick={handleLogoDoubleClick}
        >

          <img
            src="../src/assets/waveLogo.webp"
            alt="waveLogo"
            className={`w-8 h-8 transition-all ${logoAnimate ? 'animate-wave' : ''}`}
          />

          <h2 className={`text-2xl font-bold text-white transition-all ${logoAnimate ? 'animate-wave' : ''}`}>
            NamiBoard
          </h2>

        </div>

        {/* Add Workflow Button */}
        <div className="flex flex-row justify-center">
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
            <ul className="break-all space-y-2 bg-white rounded-lg p-3 shadow-inner min-h-48 max-h-79 overflow-y-auto">
              {workFlows.map((work) => (
                <li key={work.id}>
                  <Button
                    row={true}
                    onClick={() => {
                      setAboutUsClicked(false);
                      setSettingsClicked(false);
                      onSelectKanban(work.id);
                      navigate('/');
                    }}
                    className={`w-full justify-start rounded-2xl hover:border-none hover:drop-shadow ${work.id === selectedWorkFlowId
                        ? `${theme.title} text-white`
                        : 'bg-white text-gray-800'
                      }`}
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
      <div className="mt-6 border-t border-gray-300 pt-4 px-4 space-y-2 text-[15px] text-gray-700">
        <button
          onClick={handleAboutUsClick}
          className={`flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}
        >
          <img
            src="../src/assets/help-box-outline.svg"
            className="w-5 h-5"
            alt="Help"
          />
          About Us
        </button>
        <button
          className={`flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}
        >
          <img
            src="../src/assets/FAQ.svg"
            className="w-5 h-5"
            alt="FAQ"
          />
          FAQ
        </button>
        <button
          onClick={handleSettingsClick}
          className={`flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}
        >
          <img src="../src/assets/cog.svg" className="w-5 h-5" alt="Settings" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-md transition transform hover:bg-red-100 hover:text-red-600"
        >
          <img src="../src/assets/logout.svg" className="w-5 h-5" alt="Logout" />
          Logout
        </button>
        <ThemeSettings onThemeChange={handleThemeChange} />
        <div className="flex justify-center pb-4">
          <Button onClick={onSideBarToggle}>
            <img className="w-8 h-8" src="../src/assets/eye-off.svg" alt="hideSideBar" />
            Hide SideBar
          </Button>
        </div>

      </div>
    </aside>
  );
}
