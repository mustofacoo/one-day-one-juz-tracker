import { PARTICIPANT_NAMES } from '../data/constants';

export const saveToLocalStorage = (participants, monthlyRecords, currentDate) => {
  try {
    localStorage.setItem('participants', JSON.stringify(participants));
    localStorage.setItem('monthlyRecords', JSON.stringify(monthlyRecords));
    localStorage.setItem('currentDate', currentDate.toISOString());
    console.log('💾 Data saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const savedParticipants = localStorage.getItem('participants');
    const savedMonthlyRecords = localStorage.getItem('monthlyRecords');
    const savedDate = localStorage.getItem('currentDate');
    
    let participants = null;
    let monthlyRecords = {};
    let currentDate = new Date();
    
    if (savedParticipants) {
      const localParticipants = JSON.parse(savedParticipants);
      // Fix names if needed
      localParticipants.forEach((participant, index) => {
        if (PARTICIPANT_NAMES[index]) {
          participant.name = PARTICIPANT_NAMES[index];
        }
      });
      participants = localParticipants;
      console.log('📥 Participants loaded from localStorage and names updated');
    }
    
    if (savedMonthlyRecords) {
      monthlyRecords = JSON.parse(savedMonthlyRecords);
      console.log('📥 Monthly records loaded from localStorage');
    }
    
    if (savedDate) {
      currentDate = new Date(savedDate);
      console.log('📥 Current date loaded from localStorage');
    }
    
    return { participants, monthlyRecords, currentDate };
  } catch (error) {
    console.error('❌ Error loading from localStorage:', error);
    return { participants: null, monthlyRecords: {}, currentDate: new Date() };
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem('participants');
    localStorage.removeItem('monthlyRecords');
    localStorage.removeItem('currentDate');
    console.log('🗑️ LocalStorage cleared');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
};