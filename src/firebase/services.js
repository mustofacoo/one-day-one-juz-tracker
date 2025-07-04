import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';

// Participants collection
export const saveParticipant = async (participant) => {
  try {
    await setDoc(doc(db, 'participants', participant.id.toString()), participant);
    console.log(`✅ Participant ${participant.id} (${participant.name}) saved to Firebase`);
    return true;
  } catch (error) {
    console.error('❌ Error saving participant to Firebase:', error);
    return false;
  }
};

export const loadParticipants = async () => {
  try {
    const participantsSnapshot = await getDocs(
      query(collection(db, 'participants'), orderBy('id'))
    );
    
    const participants = [];
    participantsSnapshot.forEach((doc) => {
      participants.push(doc.data());
    });
    
    console.log(`📥 Loaded ${participants.length} participants from Firebase`);
    return participants;
  } catch (error) {
    console.error('❌ Error loading participants from Firebase:', error);
    return [];
  }
};

export const subscribeToParticipants = (callback) => {
  try {
    const participantsQuery = query(
      collection(db, 'participants'),
      orderBy('id')
    );
    
    return onSnapshot(participantsQuery, (snapshot) => {
      const participants = [];
      snapshot.forEach((doc) => {
        participants.push(doc.data());
      });
      callback(participants);
    });
  } catch (error) {
    console.error('❌ Error subscribing to participants:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Monthly records collection
export const saveMonthlyRecord = async (monthKey, record) => {
  try {
    await setDoc(doc(db, 'monthlyRecords', monthKey), record);
    console.log(`✅ Monthly record ${monthKey} saved to Firebase`);
    return true;
  } catch (error) {
    console.error('❌ Error saving monthly record to Firebase:', error);
    return false;
  }
};

export const loadMonthlyRecords = async () => {
  try {
    const monthlySnapshot = await getDocs(collection(db, 'monthlyRecords'));
    
    const records = {};
    monthlySnapshot.forEach((doc) => {
      records[doc.id] = doc.data();
    });
    
    console.log(`📥 Loaded monthly records from Firebase`);
    return records;
  } catch (error) {
    console.error('❌ Error loading monthly records from Firebase:', error);
    return {};
  }
};

export const subscribeToMonthlyRecords = (callback) => {
  try {
    return onSnapshot(collection(db, 'monthlyRecords'), (snapshot) => {
      const records = {};
      snapshot.forEach((doc) => {
        records[doc.id] = doc.data();
      });
      callback(records);
    });
  } catch (error) {
    console.error('❌ Error subscribing to monthly records:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Test Firebase connection
export const testConnection = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'participants'));
    console.log('🔍 Firebase connection test successful. Documents found:', snapshot.size);
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};