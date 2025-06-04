import Button from './Buttons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeSettings from './ThemeSettings';
import Modal from './Modal';

export default function Sidebar({
  startWorkFlow,
  workFlows,
  onSelectKanban,
  onSideBarToggle,
  onLogout,
  settingsClicked,
  setSettingsClicked,
  selectedWorkFlowId,
  theme,           
  setTheme,        
  onEditWorkflow,    
  onDeleteWorkflow   
}) {
  const [aboutUsClicked, setAboutUsClicked] = useState(false);
  const [logoAnimate, setLogoAnimate] = useState(false);
  let scrollTimeout = null;
  const navigate = useNavigate();
  //All these use states are being used in the modal
  const [showWorkflowModal, setShowWorkflowModal] = useState(null);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newWorkflowTitle, setNewWorkflowTitle] = useState("");

  // Length of WorkFlow
  const lengthWorkflow = workFlows.length;
  let tasksCount=0;

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
  //To navigate on and off from the settings page
  const handleSettingsClick = () => {
    if (settingsClicked) {
      setAboutUsClicked(false);
      setSettingsClicked(false);
      onSelectKanban(null);
      navigate('/');
    } else {
      setAboutUsClicked(false);
      setSettingsClicked(true);
      onSelectKanban(null);
      navigate('/settings');
    }
  };
//To navigate on and off from the aboutUs Page
  const handleAboutUsClick = () => {
    if (aboutUsClicked) {
      setSettingsClicked(false);
      setAboutUsClicked(false);
      onSelectKanban(null);
      navigate('/');
    } else {
      setSettingsClicked(false);
      setAboutUsClicked(true);
      onSelectKanban(null);
      navigate('/aboutUs');
    }
  };
  // Fun animation for NamiBoard Logo
  const handleLogoDoubleClick = () => {
    setLogoAnimate(prev => !prev);
  };
  // Allows for theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  let hoverClasses = '';

  if (theme.title === 'bg-blue-900') {
    hoverClasses = 'hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-green-900') {
    hoverClasses = 'hover:bg-green-700 hover:text-white hover:ring-2 hover:ring-green-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-purple-900') {
    hoverClasses = 'hover:bg-purple-700 hover:text-white hover:ring-2 hover:ring-purple-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-red-900') {
    hoverClasses = 'hover:bg-red-700 hover:text-white hover:ring-2 hover:ring-red-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-yellow-900') {
    hoverClasses = 'hover:bg-yellow-700 hover:text-white hover:ring-2 hover:ring-yellow-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-indigo-900') {
    hoverClasses = 'hover:bg-indigo-700 hover:text-white hover:ring-2 hover:ring-indigo-900 hover:ring-offset-2';
  } else if (theme.title === 'bg-gray-900') {
    hoverClasses = 'hover:bg-gray-700 hover:text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2';
  } else {
    hoverClasses = 'hover:bg-blue-700 hover:text-white hover:ring-2 hover:ring-blue-900 hover:ring-offset-2';
  }

  const getThemeColor = (theme) => {
    const colorMap = {
      'bg-blue-900': 'blue',
      'bg-green-900': 'green',
      'bg-purple-900': 'purple',
      'bg-red-900': 'red',
      'bg-yellow-900': 'yellow',
      'bg-indigo-900': 'indigo',
      'bg-gray-900': 'gray'
    };
    return colorMap[theme] || 'blue';
  };

  useEffect(() => {
    const handleScroll = (e) => {
      const element = e.target;
      element.classList.add('scrolling');
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        element.classList.remove('scrolling');
      }, 1000);
    };

    const scrollableElements = document.querySelectorAll('.CustomScrollbar');
    scrollableElements.forEach(element => {
      element.addEventListener('scroll', handleScroll);
    });

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollableElements.forEach(element => {
        element.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  const handleWorkflowOptions = (workflow) => {
    setShowWorkflowModal(workflow.id);
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setNewWorkflowTitle(workflow.title);
    setShowWorkflowModal(workflow.id);
  };

  const handleDeleteWorkflow = () => {
    if (editingWorkflow) {
      onDeleteWorkflow(editingWorkflow.id); // Use the prop function
      setShowDeleteConfirm(false);
      setShowWorkflowModal(null);
      setEditingWorkflow(null);
    }
  };

  const handleSaveWorkflow = (e) => {
    e.preventDefault();
    if (editingWorkflow && newWorkflowTitle.trim()) {
      onEditWorkflow(editingWorkflow.id, newWorkflowTitle.trim()); // Use the prop function
      setShowWorkflowModal(null);
      setEditingWorkflow(null);
    }
  };

  // Sort workflows based on dueDate; if missing, use a maximum date.
  const sortedWorkflows = [...workFlows].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
    return dateA - dateB;
  });

  return (
    <aside
      className={`w-72 ${theme.sidebar} CustomScrollbar overflow-y-scroll duration-500 flex flex-col justify-between`}
      style={{
        boxShadow: '6px 0 15px -3px rgba(0, 0, 0, 0.2), 3px 0 8px -4px rgba(0, 0, 0, 0.1)',
      }}>
      {/* Top */}
      <div className="px-4 pt-4 flex flex-col gap-6 m-0">
        {/* Logo */}
        <div
          className={`bg-blue-900 shadow-md rounded-lg p-4 flex items-center gap-3 cursor-pointer ${theme.title}`}
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
        <div className="flex flex-row justify-center ">
          <Button row={true} onClick={handleAddWorkflow} className={`${theme.sidebar} ${hoverClasses}`}>
            Add WorkFlow
            <img
              className="Icons w-6 h-6 ml-2"
              src="../src/assets/plus.svg"
              alt="AddButton"
            />
          </Button>
        </div>

        {/* Workflow List */}
        <div className='flex flex-col justify-start'>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Your Workflows ({lengthWorkflow})
          </h3>
          {workFlows.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No workflows yet.</p>
          ) : (
            <ul className="CustomScrollbar rounded-sm max-h-79 overflow-y-auto">
              {sortedWorkflows.map((work) => {
                tasksCount = work.columns?.reduce((total, col) => total + (col.tasks?.length || 0), 0) || 0;
                return (
                  <li key={work.id} className="w-full mb-3">
                    <div className={`w-full my-0.5 rounded-2xl flex items-center transition-colors h-18 duration-300 ${
                      work.id === selectedWorkFlowId
                        ? `${theme.title} text-white`
                        : `workflow-hover ${getThemeColor(theme.title)}`
                    }`}>
                      <button
                        onClick={() => {
                          setAboutUsClicked(false);
                          setSettingsClicked(false);
                          onSelectKanban(work.id);
                          navigate('/');
                        }}
                        className="flex-1 break-all h-full text-left px-4 relative z-10"
                      >
                        <span className="block">
                          {work.title}
                        </span>
                         <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                            <span>{work.columns?.length || 0} columns</span>
                            <span>•</span>
                            <span>{tasksCount} tasks</span>
                          </div>
                      </button>
                      <button
                      // Only handle this click here—don't let it bubble up to any parent onClick handlers
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkflowOptions(work);
                        }}
                        className="px-4 h-full relative z-10 hover:text-white"
                      >
                        ...
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Utility Links */}
      <div className="mt-10 border-t border-gray-300 pt-4 px-4 space-y-2 text-[15px] text-gray-700">
        <button onClick={handleAboutUsClick} className={`flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}>
          <img src="../src/assets/help-box-outline.svg" className="Icons w-5 h-5" alt="Help" />
          About Us
        </button>
        <button className={` flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}>
          <img src="../src/assets/FAQ.svg" className="Icons w-5 h-5" alt="FAQ" />
          FAQ
        </button>
        <button onClick={handleSettingsClick} className={`flex items-center gap-3 p-2 rounded-md transition transform ${hoverClasses}`}>
          <img src="../src/assets/cog.svg" className="Icons w-5 h-5" alt="Settings" />
          Settings
        </button>
        <button onClick={handleLogout} className=" flex items-center gap-3 p-2 rounded-md transition transform hover:bg-red-500 hover:text-white">
          <img src="../src/assets/logout.svg" className="Icons w-5 h-5" alt="Logout" />
          Logout
        </button>
        <ThemeSettings theme={theme} onThemeChange={handleThemeChange} />
        <div className="flex justify-center pb-4">
          <Button className={`${theme.sidebar} ${hoverClasses}`} onClick={onSideBarToggle} >
            <img className="Icons w-8 h-8" src="../src/assets/eye-off.svg" alt="hideSideBar" />
            Hide SideBar
          </Button>
        </div>
      </div>

      {/* Workflow Options Modal */}
      <Modal open={showWorkflowModal !== null} onClose={() => setShowWorkflowModal(null)}>
        {!editingWorkflow ? (
          <div>
            <button
              className="block w-full text-left py-2 hover:bg-gray-100"
              onClick={() => handleEditWorkflow(workFlows.find(w => w.id === showWorkflowModal))}
            >
              Edit Workflow
            </button>
            <button
              className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
              onClick={() => {
                setEditingWorkflow(workFlows.find(w => w.id === showWorkflowModal));
                setShowDeleteConfirm(true);
              }}
            >
              Delete Workflow
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveWorkflow}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
              maxLength="20"
                type="text"
                value={newWorkflowTitle || ''} // Add default empty string
                onChange={(e) => setNewWorkflowTitle(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowWorkflowModal(null);
                  setEditingWorkflow(null);
                }}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Delete Workflow</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this workflow? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteWorkflow}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
