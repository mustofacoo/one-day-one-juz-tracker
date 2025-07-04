import React from 'react';
import { JUZ_DETAILS } from '../data/constants';
import { getJakartaDateKey } from '../utils/timeUtils';

const ParticipantCard = ({ 
  participant, 
  juzNumber, 
  isAdminLoggedIn, 
  onToggleCheck, 
  onEdit 
}) => {
  const today = getJakartaDateKey();
  const isCompleted = participant.dailyProgress && participant.dailyProgress[today];
  const juzDetail = JUZ_DETAILS[juzNumber] || { 
    surah: "Detail tidak tersedia", 
    pages: "?",
    description: "Silakan cek Al-Qur'an"
  };

  const handleCardClick = () => {
    onToggleCheck(participant.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(participant.id);
  };

  return (
    <div 
      className={`participant-card ${isCompleted ? 'completed' : ''}`}
      onClick={handleCardClick}
    >
      <div className="participant-content">
        <div className="participant-info">
          <h3>{participant.name}</h3>
          <p className="juz-number">
            📖 Juz {juzNumber} (Hal. {juzDetail.pages})
          </p>
          <div className="juz-info">
            <p>{juzDetail.surah}</p>
            {juzDetail.description && (
              <p className="description">{juzDetail.description}</p>
            )}
          </div>
          <small className={isCompleted ? 'completed-text' : 'pending-text'}>
            {isCompleted ? '✅ Sudah Selesai' : '⏳ Belum selesai'}
          </small>
          {isAdminLoggedIn && (
            <button 
              className="admin-edit-btn" 
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
        <div className="participant-actions">
          <span className={`icon ${isCompleted ? 'icon-completed' : 'icon-pending'}`}>
            📖
          </span>
          <span className={`icon ${isCompleted ? 'icon-completed' : 'icon-pending'}`}>
            ✅
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;