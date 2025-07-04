import React, { useState, useEffect } from 'react';
import { getAvailableMonths, getJakartaDateKey } from '../utils/timeUtils';
import { getMonthlyStats } from '../utils/participantUtils';

const MonthlyTab = ({ participants, monthlyRecords }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    khatamCount: 0,
    totalParticipation: 0,
    participantProgress: {}
  });

  useEffect(() => {
    const months = getAvailableMonths();
    setAvailableMonths(months);
    
    // Set current month as default
    const currentMonth = getJakartaDateKey().substring(0, 7);
    if (months.length > 0) {
      const defaultMonth = months.find(m => m.key === currentMonth) || months[0];
      setSelectedMonth(defaultMonth.key);
    }
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const stats = getMonthlyStats(monthlyRecords, selectedMonth);
      setMonthlyStats(stats);
    }
  }, [selectedMonth, monthlyRecords]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="monthly-tab">
      {/* Month Selector */}
      <div className="month-selector">
        <label>Pilih Bulan:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {availableMonths.map(month => (
            <option key={month.key} value={month.key}>
              {month.name}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Stats */}
      <div className="monthly-stats">
        <div className="monthly-stat-card orange">
          <div className="monthly-stat-header">
            <span className="stat-icon">🏆</span>
            <h3>Khatam Bulan Ini</h3>
          </div>
          <div className="monthly-stat-value">{monthlyStats.khatamCount}x</div>
        </div>
        
        <div className="monthly-stat-card amber">
          <div className="monthly-stat-header">
            <span className="stat-icon">📊</span>
            <h3>Total Partisipasi</h3>
          </div>
          <div className="monthly-stat-value">{monthlyStats.totalParticipation}</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <h3>Progress Peserta</h3>
        <div className="progress-grid">
          {participants.map(participant => {
            const monthlyCount = monthlyStats.participantProgress[participant.id] || 0;
            const percentage = Math.round((monthlyCount / 30) * 100);
            
            return (
              <div key={participant.id} className="progress-item">
                <div className="progress-header">
                  <span className="progress-name">{participant.name}</span>
                  <span className="progress-count">{monthlyCount}/30</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="progress-percentage">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTab;