import React from 'react';

const Navigation = ({ activeTab, onTabChange, isAdminLoggedIn }) => {
  const handleTabClick = (tabName) => {
    if (tabName === 'admin' && !isAdminLoggedIn) {
      // Redirect to daily tab if not admin
      onTabChange('daily');
      return;
    }
    onTabChange(tabName);
  };

  return (
    <div className="nav-container">
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => handleTabClick('daily')}
        >
          Harian
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => handleTabClick('monthly')}
        >
          Rekap Bulanan
        </button>
        
        {isAdminLoggedIn && (
          <button 
            className={`nav-tab admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabClick('admin')}
          >
            Admin Panel
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;