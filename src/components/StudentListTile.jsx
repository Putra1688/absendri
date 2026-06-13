import React from 'react';

function StudentListTile({ student, status, onStatusChange }) {
  return (
    <div className="glass-card student-tile" style={{ padding: '10px 14px', marginBottom: '8px' }}>
      <div className="student-info">
        <div className="student-name-container" title={student.name}>
          <span className="student-number">{student.number}</span>
          <span className="student-name">{student.name}</span>
        </div>
      </div>
      <div className="status-buttons">
        <button 
          className={`status-btn hadir ${status === 'hadir' ? 'active' : ''}`}
          onClick={() => onStatusChange('hadir')}
        >
          H
        </button>
        <button 
          className={`status-btn izin ${status === 'izin' ? 'active' : ''}`}
          onClick={() => onStatusChange('izin')}
        >
          I
        </button>
        <button 
          className={`status-btn sakit ${status === 'sakit' ? 'active' : ''}`}
          onClick={() => onStatusChange('sakit')}
        >
          S
        </button>
        <button 
          className={`status-btn alpha ${status === 'alpha' ? 'active' : ''}`}
          onClick={() => onStatusChange('alpha')}
        >
          A
        </button>
      </div>
    </div>
  );
}

export default StudentListTile;
