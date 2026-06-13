import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, CheckSquare, WifiOff } from 'lucide-react';
import StudentListTile from '../components/StudentListTile';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';

// Dummy student data
const dummyStudents = [
  { id: '1', number: 1, name: 'Ahmad Budi' },
  { id: '2', number: 2, name: 'Siti Nurhaliza' },
  { id: '3', number: 3, name: 'Bambang Pamungkas Putra Pratama yang Sangat Panjang Sekali Namanya' },
  { id: '4', number: 4, name: 'Rina Nose' },
];

function AttendancePage() {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Ambil data kelas dari state router, atau gunakan default
  const classData = location.state?.classData || { 
    name: `Kelas ${classId}`, 
    color: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' 
  };

  useEffect(() => {
    // Load existing attendance from localStorage if already submitted today
    const today = new Date().toLocaleDateString('id-ID');
    const savedData = JSON.parse(localStorage.getItem('absensiData') || '{}');
    if (savedData[classData.id] && savedData[classData.id].date === today) {
      setAttendance(savedData[classData.id].attendance);
      setIsSubmittedToday(true);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [classData.id]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const allHadir = {};
    dummyStudents.forEach(student => {
      allHadir[student.id] = 'hadir';
    });
    setAttendance(allHadir);
  };

  const doSaveToLocal = () => {
    const today = new Date().toLocaleDateString('id-ID');
    const savedData = JSON.parse(localStorage.getItem('absensiData') || '{}');
    savedData[classData.id] = { date: today, attendance: attendance };
    localStorage.setItem('absensiData', JSON.stringify(savedData));
    setIsSubmittedToday(true);
  };

  const handleSubmit = () => {
    if (Object.keys(attendance).length < dummyStudents.length) {
      alert('Harap lengkapi absensi untuk seluruh murid terlebih dahulu!');
      return;
    }
    
    if (isSubmittedToday) {
      setShowConfirmModal(true);
    } else {
      doSaveToLocal();
      setShowModal(true);
    }
  };

  const handleConfirmUpdate = () => {
    doSaveToLocal();
    setShowConfirmModal(false);
    setShowModal(true);
  };

  let statusText = "";
  if (isOffline) {
    statusText = isSubmittedToday ? "Menunggu Jaringan" : "Mode Offline";
  } else if (isSubmittedToday) {
    statusText = "Hari ini sudah terabsen";
  }

  return (
    <div className="page" style={{ background: classData.color, minHeight: '100vh', margin: '-32px -20px -120px -20px', padding: '32px 20px 120px 20px' }}>
      <div className="attendance-header animate-fade-in-up" style={{ animationDelay: '0.05s', borderBottomColor: 'rgba(255,255,255,0.2)' }}>
        <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="attendance-title" style={{ color: 'white' }}>{classData.name}</h1>
          <p className="attendance-date" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {statusText && <span style={{ marginLeft: '8px', padding: '2px 8px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>{statusText}</span>}
          </p>
        </div>
        {isOffline && (
          <div className="offline-badge" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }}>
            <WifiOff size={16} /> Offline
          </div>
        )}
      </div>

        <div className="dashboard-summary animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: 'none' }}>
            <h3 className="stat-num">{Object.keys(attendance).length}</h3>
            <p className="stat-label" style={{ color: 'white' }}>Sudah Absen</p>
          </div>
          <div className="stat-card" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: 'none' }}>
            <h3 className="stat-num">{dummyStudents.length - Object.keys(attendance).length}</h3>
            <p className="stat-label" style={{ color: 'white' }}>Belum Absen</p>
          </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.15s', marginBottom: '16px' }}>
        <button onClick={handleMarkAllPresent} style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem' }}>
          <CheckSquare size={20} /> Tandai Semua Hadir
        </button>
      </div>

      <div className="student-list" style={{marginBottom: '80px'}}>
        {dummyStudents.map((student, index) => (
          <div key={student.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
            <StudentListTile 
              student={student} 
              status={attendance[student.id]}
              onStatusChange={(status) => handleStatusChange(student.id, status)}
            />
          </div>
        ))}
      </div>

      <div className="bottom-bar" style={{ background: 'rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.2)' }}>
        <button className="btn-primary" onClick={handleSubmit} style={{ background: 'white', color: 'var(--text-main)' }}>
          <Send size={20} /> {isSubmittedToday ? 'Update Perubahan' : 'Submit Kehadiran'}
        </button>
      </div>
      
      <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmUpdate} />
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} isOffline={isOffline} />
    </div>
  );
}

export default AttendancePage;
