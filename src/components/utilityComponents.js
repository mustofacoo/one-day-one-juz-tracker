import React, { useState, useEffect } from 'react';
import { 
  getJakartaTimeString, 
  getTimeUntilMidnight, 
  formatCountdown,
  formatDateDisplay 
} from '../utils/timeUtils';

// Timezone Info Component
export const TimezoneInfo = () => {
  const [currentTime, setCurrentTime] = useState(getJakartaTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getJakartaTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timezone-info">
      <span>🕐 Waktu: {currentTime} WIB</span>
    </div>
  );
};

// Countdown Timer Component
export const CountdownTimer = () => {
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds } = formatCountdown(timeUntilReset);
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  let detailText = '';
  if (hours < 1) {
    detailText = `Centang akan direset dan peserta akan berotasi dalam ${minutes} menit ${seconds} detik`;
  } else if (hours < 6) {
    detailText = `Reset dalam ${hours} jam ${minutes} menit - Centang akan dihapus & peserta berotasi`;
  } else {
    const nextMidnight = new Date();
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    detailText = `Reset berikutnya: ${nextMidnight.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
  }

  return (
    <div className="countdown-info">
      <div className="countdown-header">
        ⏰ Reset & Rotasi Berikutnya
      </div>
      <div className="countdown-timer">
        {formattedTime}
      </div>
      <div className="countdown-details">
        {detailText}
      </div>
    </div>
  );
};

// Firebase Status Component
export const FirebaseStatus = ({ status }) => {
  return (
    <div className="firebase-status">
      <span>Status: {status}</span>
    </div>
  );
};

// Stats Grid Component
export const StatsGrid = ({ currentDate, todayStats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card orange">
        <div className="stat-content">
          <span className="stat-icon">📅</span>
          <span className="stat-text">{formatDateDisplay(currentDate)}</span>
        </div>
      </div>
      
      <div className="stat-card amber">
        <div className="stat-content">
          <span className="stat-icon">👥</span>
          <span className="stat-text">
            {todayStats.completedToday}/30 Selesai Hari Ini
          </span>
        </div>
      </div>
      
      <div className="stat-card yellow">
        <div className="stat-content">
          <span className="stat-icon">🏆</span>
          <span className="stat-text">
            {todayStats.isKhatamComplete 
              ? 'Khatam Hari Ini! 🎉' 
              : `${todayStats.remainingForKhatam} Lagi untuk Khatam`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

// Daily Info Component
export const DailyInfo = () => {
  return (
    <div className="daily-info">
      <div className="info-card">
        <h4>Ya Allah, turunkan rahmat kepada kami dengan wasilah bacaan Al-Quran</h4>
        <p>Jadikan kami lebih mencintai untuk berinteraksi dengan Al Qur'an daripada berbuat sia-sia</p>
        <p>Anugerahkan kami pemahaman Al Qur'an dan pengamalannya</p>
        <p>Perkenankan Al-Qur'an memberi syafaat untuk kami</p>
      </div>
    </div>
  );
};

export default {
  TimezoneInfo,
  CountdownTimer,
  FirebaseStatus,
  StatsGrid,
  DailyInfo
};