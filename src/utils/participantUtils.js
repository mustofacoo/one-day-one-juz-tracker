import { PARTICIPANT_NAMES, PROGRAM_START_DATE } from '../data/constants';
import { getJakartaTime, getJakartaDateKey } from './timeUtils';

export const initializeParticipants = () => {
  console.log('🔧 Initializing participants...');
  
  const participants = Array.from({ length: 30 }, (_, i) => {
    const participantName = PARTICIPANT_NAMES[i] || `Peserta ${i + 1}`;
    
    return {
      id: i + 1,
      name: participantName,
      dailyProgress: {},
      currentJuz: i + 1, // Default juz
      lastUpdated: getJakartaDateKey()
    };
  });
  
  console.log('✅ Participants initialized:', participants.length);
  return participants;
};

export const getRotatedParticipantOrder = (participants, currentDate) => {
  // Calculate days since program start using Jakarta time
  const jakartaCurrentDate = new Date(currentDate.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  const jakartaStartDate = new Date(PROGRAM_START_DATE.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  
  const diffTime = jakartaCurrentDate - jakartaStartDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Create rotated order
  // Day 0: [Syafiq, Siti, Muhammad, ..., Umming] → Juz [1,2,3,...,30]
  // Day 1: [Umming, Syafiq, Siti, ..., Anas] → Juz [1,2,3,...,30]
  
  const rotatedOrder = [];
  for (let i = 0; i < 30; i++) {
    const participantIndex = (30 - diffDays + i) % 30;
    rotatedOrder.push(participants[participantIndex]);
  }
  
  console.log(`📖 Day ${diffDays}: Rotated order - Juz 1: ${rotatedOrder[0]?.name}, Juz 30: ${rotatedOrder[29]?.name}`);
  return rotatedOrder;
};

export const updateMonthlyRecords = (participants, monthlyRecords) => {
  const today = getJakartaDateKey();
  const monthKey = today.substring(0, 7);
  
  if (!monthlyRecords[monthKey]) {
    monthlyRecords[monthKey] = {
      khatamCount: 0,
      participantProgress: {},
      dailyCompletions: {}
    };
  }
  
  const monthRecord = monthlyRecords[monthKey];
  
  // Update participant progress
  participants.forEach(participant => {
    const monthlyChecks = Object.keys(participant.dailyProgress || {})
      .filter(date => date.startsWith(monthKey))
      .length;
    monthRecord.participantProgress[participant.id] = monthlyChecks;
  });
  
  // Check for khatam
  const todayCompletions = participants.filter(p => p.dailyProgress && p.dailyProgress[today]).length;
  if (todayCompletions === 30) {
    monthRecord.dailyCompletions[today] = true;
  } else {
    delete monthRecord.dailyCompletions[today];
  }
  
  monthRecord.khatamCount = Object.keys(monthRecord.dailyCompletions).length;
  
  return { ...monthlyRecords, [monthKey]: monthRecord };
};

export const getTodayStats = (participants) => {
  const today = getJakartaDateKey();
  const completedToday = participants.filter(p => p.dailyProgress && p.dailyProgress[today]).length;
  
  return {
    completedToday,
    remainingForKhatam: 30 - completedToday,
    isKhatamComplete: completedToday === 30
  };
};

export const getMonthlyStats = (monthlyRecords, selectedMonth) => {
  const monthRecord = monthlyRecords[selectedMonth] || {
    khatamCount: 0,
    participantProgress: {},
    dailyCompletions: {}
  };
  
  const totalParticipation = Object.values(monthRecord.participantProgress)
    .reduce((sum, count) => sum + count, 0);
  
  return {
    khatamCount: monthRecord.khatamCount,
    totalParticipation,
    participantProgress: monthRecord.participantProgress
  };
};