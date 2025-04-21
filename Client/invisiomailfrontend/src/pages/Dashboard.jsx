import React, { useState, useEffect } from 'react';
import "../Styles/Dashboard/Dashboard.css"
import LoadingScreen from '../components/SideBar/Loading';
import MobileBottomBar from '../components/SideBar/MobileBottomBar';
import Header from '../components/SideBar/Header';
import SidebarContent from "../components/SideBar/SideBarContent"
import LeftMiniBar from "../components/SideBar/LeftMiniBar"
import DashboardContent from '../components/SideBar/DashBoardContent';
import SettingsPanel from '../components/SideBar/SettingsPanel';
import AuthorLinks from '../components/SideBar/AutoLinks';



function Dashboard() {
  // State management previously in App.js is now here
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSidebarTab, setCurrentSidebarTab] = useState('linksTab');
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // Effects previously in App.js are now here
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const watchScreen = () => {
      if (window.innerWidth <= 1024 && isSidebarOpen) {
        // Optional: setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', watchScreen);
    return () => {
      window.removeEventListener('resize', watchScreen);
    };
  }, [isSidebarOpen]);

  // Handlers previously in App.js are now here
  const handleToggleSidebar = (tabName) => {
    if (isSidebarOpen && currentSidebarTab === tabName) {
      setIsSidebarOpen(false);
    } else {
      setCurrentSidebarTab(tabName);
      setIsSidebarOpen(true);
      setIsSettingsPanelOpen(false); 
    }
  };

  const handleToggleSettings = () => {
    setIsSettingsPanelOpen(!isSettingsPanelOpen);
    if (!isSettingsPanelOpen) {
      setIsSidebarOpen(false); // Close sidebar when opening settings
    }
  };

  const closeSettingsPanel = () => {
    setIsSettingsPanelOpen(false);
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  }

  // Placeholder user data
  const userData = {
    avatarSrc: "https://avatars.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4",
    userName: "Ahmed Kamel"
  };

  // JSX structure previously in App.js is now here
  return (
    <> {/* Use Fragment or a single root div if preferred */}
      <LoadingScreen isLoading={isLoading} />

      <div className="dashboard-layout">
        {/* Sidebar container (Mini + Content) */}
        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
          {/* Backdrop for mobile sidebar */}
          {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true"></div>}

          <LeftMiniBar
            isSidebarOpen={isSidebarOpen}
            currentSidebarTab={currentSidebarTab}
            onToggleSidebar={handleToggleSidebar}
            avatarSrc={userData.avatarSrc}
            userName={userData.userName}
          />
          <SidebarContent
            isOpen={isSidebarOpen}
            currentTab={currentSidebarTab}
          />
        </div>

        {/* Mobile Bottom Bar */}
        <MobileBottomBar
          isSidebarOpen={isSidebarOpen}
          currentSidebarTab={currentSidebarTab}
          onToggleSidebar={handleToggleSidebar}
          avatarSrc={userData.avatarSrc}
          userName={userData.userName}
        />

        {/* Main Content Area */}
        <div className="main-area">
          <Header
            onToggleSettings={handleToggleSettings}
            onToggleSidebar={handleToggleSidebar} // Pass handler for mobile subheader
            className="dashboard-header" // Add class for potential specific styling
          />
          {/* Content Wrapper for scrolling */}
          <div className="content-wrapper">
            <DashboardContent />
          </div>
        </div>
      </div>

      {/* Panels */}
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={closeSettingsPanel}
      />

      {/* Fixed Links */}
      <AuthorLinks />
    </>
  );
}

export default Dashboard;
