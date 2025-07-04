import React, { useState, useEffect } from 'react';
import ParticipantCard from './ParticipantCard';
import { 
  TimezoneInfo, 
  CountdownTimer, 
  FirebaseStatus, 
  StatsGrid, 
  DailyInfo 
} from './UtilityComponents';
import { getRotatedParticipantOrder } from '../utils/participantUtils';

const DailyTab = ({ 
  participants, 
  currentDate, 
  todayStats, 
  firebaseStatus,
  isAdminLoggedIn,
  onToggleCheck,
  onEditParticipant 
}) => {
  const [rotatedParticipants, setRotatedParticipants] = useState([]);

  useEffect(() => {
    if (participants.length === 30) {
      const rotated = getRotatedParticipantOrder(participants, currentDate);
      setRotatedParticipants(rotated);
    }
  }, [participants, currentDate]);

  return (
    <div className="daily-tab">
      <TimezoneInfo />
      <CountdownTimer />
      <FirebaseStatus status={firebaseStatus} />
      
      <StatsGrid 
        currentDate={currentDate}
        todayStats={todayStats}
      />
      
      <DailyInfo />
      
      <div className="participants-grid">
        {rotatedParticipants.map((participant, index) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            juzNumber={index + 1}
            isAdminLoggedIn={isAdminLoggedIn}
            onToggleCheck={onToggleCheck}
            onEdit={onEditParticipant}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyTab;