import React, { useState } from 'react';
import { ADMIN_CREDENTIALS } from '../data/constants';

// Admin Tab Component
export const AdminTab = ({ 
  onBulkEdit, 
  onExportData, 
  onResetSystem, 
  onForceReset 
}) => {
  return (
    <div className="admin-tab">
      <div className="admin-panel">
        <h3>👑 Admin Panel</h3>
        <div className="admin-actions">
          <div className="admin-action-card" onClick={onBulkEdit}>
            <h4>👥 Edit Nama Peserta</h4>
            <p>Ubah nama peserta secara massal atau individual</p>
          </div>
          
          <div className="admin-action-card" onClick={() => {
            alert('📝 Untuk mengelola progress individual, klik tombol "Edit" pada kartu peserta di tab Harian.');
          }}>
            <h4>📝 Kelola Progress</h4>
            <p>Edit data pengerjaan tugas harian peserta</p>
          </div>
          
          <div className="admin-action-card" onClick={onExportData}>
            <h4>📊 Export Data</h4>
            <p>Download data progress dalam format JSON</p>
          </div>
          
          <div className="admin-action-card" onClick={onResetSystem}>
            <h4>🔄 Reset Sistem</h4>
            <p>Reset ulang sistem ke hari ini</p>
          </div>
          
          <div className="admin-action-card" onClick={onForceReset}>
            <h4>⚡ Force Reset Now</h4>
            <p>Paksa reset dan rotasi sekarang juga</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Login Modal Component
export const AdminLoginModal = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin();
      setError('');
    } else {
      setError('Username atau password salah!');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="admin-modal" onKeyDown={handleKeyDown}>
      <div className="admin-modal-content">
        <h3>🔐 Admin Login</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoFocus
            />
          </div>
          
          <div className="admin-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </div>
          
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
              ❌ {error}
            </div>
          )}
          
          <div className="admin-modal-buttons">
            <button 
              type="button" 
              className="admin-btn admin-btn-secondary" 
              onClick={onClose}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Participant Modal Component
export const EditParticipantModal = ({ participant, onSave, onClose }) => {
  const [name, setName] = useState(participant.name);
  const [progressData, setProgressData] = useState(participant.dailyProgress || {});
  const [newDate, setNewDate] = useState('');

  const handleSave = () => {
    const updatedParticipant = {
      ...participant,
      name: name.trim(),
      dailyProgress: progressData
    };
    
    onSave(updatedParticipant);
  };

  const toggleProgress = (date) => {
    setProgressData(prev => {
      const newProgress = { ...prev };
      if (newProgress[date]) {
        delete newProgress[date];
      } else {
        newProgress[date] = true;
      }
      return newProgress;
    });
  };

  const addProgressDate = () => {
    if (!newDate) {
      alert('❌ Pilih tanggal terlebih dahulu!');
      return;
    }
    
    setProgressData(prev => ({
      ...prev,
      [newDate]: true
    }));
    
    setNewDate('');
  };

  const removeProgressDate = (date) => {
    if (window.confirm(`⚠️ Hapus data pengerjaan tanggal ${new Date(date + 'T12:00:00').toLocaleDateString('id-ID')}?`)) {
      setProgressData(prev => {
        const newProgress = { ...prev };
        delete newProgress[date];
        return newProgress;
      });
    }
  };

  const progressDates = Object.keys(progressData).sort().reverse();

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h3>✏️ Edit Peserta</h3>
        
        <div className="edit-form-group">
          <label>Nama Peserta:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama baru"
          />
        </div>
        
        <div className="edit-form-group">
          <label>Progress Harian:</label>
          <div className="progress-editor">
            <h5>Data Pengerjaan Tugas</h5>
            
            <div className="date-progress-list">
              {progressDates.length === 0 ? (
                <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>
                  Belum ada data progress
                </p>
              ) : (
                progressDates.map(date => {
                  const dateDisplay = new Date(date + 'T12:00:00').toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

                  return (
                    <div key={date} className="date-progress-item">
                      <span>{dateDisplay}</span>
                      <div className="progress-toggle">
                        <input
                          type="checkbox"
                          className="progress-checkbox"
                          checked={progressData[date] || false}
                          onChange={() => toggleProgress(date)}
                        />
                        <button
                          type="button"
                          className="remove-date-btn"
                          onClick={() => removeProgressDate(date)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="add-date-section">
              <h5>Tambah Tanggal Baru</h5>
              <div className="add-date-form">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  max="2025-12-31"
                />
                <button
                  type="button"
                  className="add-date-btn"
                  onClick={addProgressDate}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-modal-buttons">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// Bulk Edit Modal Component
export const BulkEditModal = ({ participants, onSave, onClose }) => {
  const [participantNames, setParticipantNames] = useState(
    participants.reduce((acc, participant) => {
      acc[participant.id] = participant.name;
      return acc;
    }, {})
  );

  const handleNameChange = (participantId, newName) => {
    setParticipantNames(prev => ({
      ...prev,
      [participantId]: newName
    }));
  };

  const handleSave = () => {
    const updatedParticipants = participants.map(participant => ({
      ...participant,
      name: participantNames[participant.id] || participant.name
    }));

    onSave(updatedParticipants);
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h3>👥 Edit Nama Peserta</h3>
        
        <div className="bulk-edit-list">
          {participants.map(participant => (
            <div key={participant.id} className="edit-form-group">
              <label>Peserta {participant.id}:</label>
              <input
                type="text"
                value={participantNames[participant.id]}
                onChange={(e) => handleNameChange(participant.id, e.target.value)}
                placeholder="Nama peserta"
              />
            </div>
          ))}
        </div>

        <div className="admin-modal-buttons">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
          >
            Simpan Semua
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  AdminTab,
  AdminLoginModal,
  EditParticipantModal,
  BulkEditModal
};