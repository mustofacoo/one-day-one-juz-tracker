import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import DailyTab from './components/DailyTab';
import MonthlyTab from './components/MonthlyTab';
import AdminTab from './components/AdminTab';
import AdminLoginModal from './components/AdminLoginModal';
import EditParticipantModal from './components/EditParticipantModal';
import BulkEditModal from './components/BulkEditModal';

// Firebase services
import {
  loadParticipants,
  loadMonthlyRecords,
  saveParticipant,
  saveMonthlyRecord,
  subscribeToParticipants,
  subscribeToMonthlyRecords,
  testConnection
} from './firebase/services';

// Utils
import { getJakartaTime, getJakartaDateKey } from './utils/timeUtils';
import { 
  initializeParticipants, 
  updateMonthlyRecords, 
  getTodayStats 
} from './utils/participantUtils';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from './utils/localStorage';

function App() {
  // State management
  const [participants, setParticipants] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState({});
  const [currentDate, setCurrentDate] = useState(getJakartaTime());
  const [activeTab, setActiveTab] = useState('daily');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState('🟡 Checking Firebase...');
  
  // Modal states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  
  // Reset management
  const [isResetting, setIsResetting] = useState(false);
  const [lastResetCheck, setLastResetCheck] = useState(getJakartaDateKey());

  // Initialize Firebase and load data
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      // Test Firebase connection
      const isConnected = await testConnection();
      setIsFirebaseConnected(isConnected);
      
      if (isConnected) {
        setFirebaseStatus('🟢 CENTANG SESUAI NAMA | Project: ibkangaji');
        
        // Load data from Firebase
        const [firebaseParticipants, firebaseMonthlyRecords] = await Promise.all([
          loadParticipants(),
          loadMonthlyRecords()
        ]);
        
        if (firebaseParticipants.length === 30) {
          setParticipants(firebaseParticipants);
          console.log('📥 All 30 participants loaded from Firebase');
        } else {
          // Initialize participants if Firebase is empty
          const initialParticipants = initializeParticipants();
          setParticipants(initialParticipants);
          
          // Save to Firebase
          initialParticipants.forEach(participant => {
            saveParticipant(participant);
          });
        }
        
        setMonthlyRecords(firebaseMonthlyRecords);
        
        // Setup real-time listeners
        const unsubscribeParticipants = subscribeToParticipants((newParticipants) => {
          if (!isResetting && newParticipants.length === 30) {
            setParticipants(newParticipants);
            console.log('📡 Real-time update: participants');
          }
        });
        
        const unsubscribeMonthly = subscribeToMonthlyRecords((newRecords) => {
          setMonthlyRecords(newRecords);
          console.log('📡 Real-time update: monthly records');
        });
        
        // Cleanup listeners on unmount
        return () => {
          unsubscribeParticipants();
          unsubscribeMonthly();
        };
        
      } else {
        setFirebaseStatus('🔴 Firebase offline - Using local storage');
        
        // Load from localStorage as fallback
        const { participants: localParticipants } = loadFromLocalStorage();
        if (localParticipants && localParticipants.length === 30) {
          setParticipants(localParticipants);
        } else {
          setParticipants(initializeParticipants());
        }
      }
    };
    
    initializeApp();
  }, [isResetting]);

  // Setup daily reset check
  useEffect(() => {
    const checkForDailyReset = () => {
      const today = getJakartaDateKey();
      const currentHour = getJakartaTime().getHours();
      const currentMinute = getJakartaTime().getMinutes();
      
      // Reset if date changed and not currently resetting
      if (lastResetCheck !== today && !isResetting) {
        console.log('🔄 Date changed detected, performing reset');
        performDailyReset();
      }
      
      // Force reset if it's past 00:05 and no reset detected
      if (currentHour === 0 && currentMinute >= 5 && lastResetCheck !== today && !isResetting) {
        console.log('🚨 Force reset triggered - it\'s past 00:05');
        performDailyReset();
      }
      
      setLastResetCheck(today);
    };
    
    // Check every 10 seconds
    const interval = setInterval(checkForDailyReset, 10000);
    
    // Schedule midnight reset
    const scheduleMidnightReset = () => {
      const now = getJakartaTime();
      const nextMidnight = new Date(now.getTime());
      nextMidnight.setHours(0, 0, 0, 0);
      nextMidnight.setDate(nextMidnight.getDate() + 1);
      
      const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log('🌙 MIDNIGHT RESET TRIGGERED');
        performDailyReset();
      }, timeUntilMidnight);
    };
    
    scheduleMidnightReset();
    
    return () => clearInterval(interval);
  }, [lastResetCheck, isResetting]);

  // Daily reset function
  const performDailyReset = useCallback(() => {
    if (isResetting) {
      console.log('⚠️ Reset already in progress, skipping');
      return;
    }
    
    setIsResetting(true);
    console.log('🔄 Performing daily reset...');
    
    try {
      const now = getJakartaTime();
      setCurrentDate(now);
      setLastResetCheck(getJakartaDateKey());
      
      // Save data
      participants.forEach(participant => {
        if (isFirebaseConnected) {
          saveParticipant(participant);
        }
      });
      
      saveToLocalStorage(participants, monthlyRecords, now);
      
      setFirebaseStatus(
        `🌅 Reset berhasil pukul ${now.toLocaleTimeString('id-ID')} WIB | Project: ibkangaji`
      );
      
      console.log('✅ Daily reset completed successfully');
      
    } catch (error) {
      console.error('❌ Error during reset:', error);
    } finally {
      setTimeout(() => {
        setIsResetting(false);
      }, 3000);
    }
  }, [participants, monthlyRecords, isFirebaseConnected, isResetting]);

  // Toggle participant progress
  const toggleParticipantCheck = (participantId) => {
    const today = getJakartaDateKey();
    
    setParticipants(prevParticipants => {
      const updatedParticipants = prevParticipants.map(participant => {
        if (participant.id === participantId) {
          const newProgress = { ...participant.dailyProgress };
          
          if (newProgress[today]) {
            delete newProgress[today];
          } else {
            newProgress[today] = true;
          }
          
          const updatedParticipant = {
            ...participant,
            dailyProgress: newProgress
          };
          
          // Save to Firebase
          if (isFirebaseConnected) {
            saveParticipant(updatedParticipant);
          }
          
          return updatedParticipant;
        }
        return participant;
      });
      
      // Update monthly records
      const updatedMonthlyRecords = updateMonthlyRecords(updatedParticipants, monthlyRecords);
      setMonthlyRecords(updatedMonthlyRecords);
      
      // Save to localStorage
      saveToLocalStorage(updatedParticipants, updatedMonthlyRecords, currentDate);
      
      return updatedParticipants;
    });
  };

  // Admin functions
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('daily');
  };

  const openEditParticipant = (participantId) => {
    const participant = participants.find(p => p.id === participantId);
    setEditingParticipant(participant);
    setShowEditModal(true);
  };

  const saveParticipantEdit = (updatedParticipant) => {
    setParticipants(prevParticipants => {
      const updatedParticipants = prevParticipants.map(p =>
        p.id === updatedParticipant.id ? updatedParticipant : p
      );
      
      // Save to Firebase
      if (isFirebaseConnected) {
        saveParticipant(updatedParticipant);
      }
      
      // Update monthly records
      const updatedMonthlyRecords = updateMonthlyRecords(updatedParticipants, monthlyRecords);
      setMonthlyRecords(updatedMonthlyRecords);
      
      // Save to localStorage
      saveToLocalStorage(updatedParticipants, updatedMonthlyRecords, currentDate);
      
      return updatedParticipants;
    });
    
    setShowEditModal(false);
    setEditingParticipant(null);
  };

  const saveBulkEdit = (updatedParticipants) => {
    setParticipants(updatedParticipants);
    
    // Save to Firebase
    if (isFirebaseConnected) {
      updatedParticipants.forEach(participant => {
        saveParticipant(participant);
      });
    }
    
    // Save to localStorage
    saveToLocalStorage(updatedParticipants, monthlyRecords, currentDate);
    
    setShowBulkEditModal(false);
  };

  // Export data function
  const exportData = () => {
    const exportData = {
      participants,
      monthlyRecords,
      exportDate: getJakartaDateKey(),
      totalParticipants: participants.length
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `quran_tracker_data_${getJakartaDateKey()}.json`;
    link.click();

    alert('📊 Data berhasil diexport! File akan didownload otomatis.');
  };

  // Reset system function
  const resetSystem = () => {
    if (!window.confirm('⚠️ PERINGATAN! Ini akan mereset sistem dan menghapus semua progress.\n\nApakah Anda yakin?')) {
      return;
    }

    if (!window.confirm('🚨 KONFIRMASI TERAKHIR! Semua data progress akan hilang!\n\nLanjutkan reset?')) {
      return;
    }

    // Reset all progress
    const resetParticipants = participants.map(participant => ({
      ...participant,
      dailyProgress: {}
    }));

    setParticipants(resetParticipants);
    setMonthlyRecords({});
    setCurrentDate(getJakartaTime());

    // Save to Firebase
    if (isFirebaseConnected) {
      resetParticipants.forEach(participant => {
        saveParticipant(participant);
      });
    }

    // Save to localStorage
    saveToLocalStorage(resetParticipants, {}, getJakartaTime());

    alert('✅ Sistem berhasil direset! Program dimulai ulang dari hari ini.');
  };

  // Force reset function
  const forceReset = () => {
    if (!window.confirm('⚡ Paksa reset sekarang?\n\nIni akan mereset centang dan merotasi peserta segera.')) {
      return;
    }

    setIsResetting(false); // Reset flag
    performDailyReset();
    alert('✅ Reset paksa berhasil! Peserta telah dirotasi.');
  };

  // Get today's stats
  const todayStats = getTodayStats(participants);

  return (
    <div className="app">
      <div className="app-container">
        <Header 
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminToggle={() => setShowAdminLogin(true)}
          onAdminLogout={handleAdminLogout}
        />
        
        <Navigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAdminLoggedIn={isAdminLoggedIn}
        />
        
        {activeTab === 'daily' && (
          <DailyTab
            participants={participants}
            currentDate={currentDate}
            todayStats={todayStats}
            firebaseStatus={firebaseStatus}
            isAdminLoggedIn={isAdminLoggedIn}
            onToggleCheck={toggleParticipantCheck}
            onEditParticipant={openEditParticipant}
          />
        )}
        
        {activeTab === 'monthly' && (
          <MonthlyTab
            participants={participants}
            monthlyRecords={monthlyRecords}
          />
        )}
        
        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminTab
            onBulkEdit={() => setShowBulkEditModal(true)}
            onExportData={exportData}
            onResetSystem={resetSystem}
            onForceReset={forceReset}
          />
        )}
        
        {/* Modals */}
        {showAdminLogin && (
          <AdminLoginModal
            onLogin={handleAdminLogin}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
        
        {showEditModal && editingParticipant && (
          <EditParticipantModal
            participant={editingParticipant}
            onSave={saveParticipantEdit}
            onClose={() => {
              setShowEditModal(false);
              setEditingParticipant(null);
            }}
          />
        )}
        
        {showBulkEditModal && (
          <BulkEditModal
            participants={participants}
            onSave={saveBulkEdit}
            onClose={() => setShowBulkEditModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;