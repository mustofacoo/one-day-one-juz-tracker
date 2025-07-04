import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import DailyTab from './components/DailyTab';
import MonthlyTab from './components/MonthlyTab';
import { AdminTab, AdminLoginModal, EditParticipantModal, BulkEditModal } from './components/AdminComponents';

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