import React from 'react';

const Header = ({ isAdminLoggedIn, onAdminToggle, onAdminLogout }) => {
  return (
    <div className="header">
      <button className="admin-toggle" onClick={onAdminToggle}>
        🔧 Admin
      </button>
      
      <h1 className="main-title">One Day One Juz Ibnu Katsir</h1>
      <p className="subtitle">Memantau progress membaca Al-Qur'an bersama</p>
      
      {isAdminLoggedIn && (
        <div className="admin-status">
          👑 Mode Admin Aktif | 
          <button 
            onClick={onAdminLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;