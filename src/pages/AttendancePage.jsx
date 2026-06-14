import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, CheckSquare, WifiOff, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import StudentListTile from '../components/StudentListTile';
import SuccessModal from '../components/SuccessModal';
import ConfirmModal from '../components/ConfirmModal';
import { fetchStudents, submitAttendance } from '../api/googleSheets';

function AttendancePage() {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    const loadStudentData = async () => {
      if (!classData.sheetId) {
        setStudentError('ID Spreadsheet Kelas belum disetel di Master. Hubungi admin.');
        setIsLoadingStudents(false);
        return;
      }
      try {
        setIsLoadingStudents(true);
        const fetchedStudents = await fetchStudents(classData.sheetId);
        // Map data agar kompatibel dengan props StudentListTile
        const mappedStudents = fetchedStudents.map(s => ({
          id: s.no_absen,
          number: s.no_absen,
          name: s.name
        }));
        setStudents(mappedStudents);
        setStudentError(null);
      } catch (error) {
        setStudentError('Gagal memuat data siswa. Pastikan internet aktif.');
      } finally {
        setIsLoadingStudents(false);
      }
    };
    
    loadStudentData();

    // Load existing attendance from localStorage
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
  }, [classData.id, classData.sheetId]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const allHadir = {};
    students.forEach(student => {
      allHadir[student.id] = 'hadir'; // Komponen StudentListTile mengecek 'hadir', 'sakit', dll. Wait! StudentListTile mengeksekusi ini.
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

  const handleSubmit = async () => {
    if (Object.keys(attendance).length < students.length) {
      alert('Harap lengkapi absensi untuk seluruh murid terlebih dahulu!');
      return;
    }
    
    // Kirim data ke API jika sedang online
    if (!isOffline) {
      try {
        setIsSubmitting(true);
        // Format array payload (Konversi dari status huruf kecil ke inisial huruf kapital)
        const formatStatus = (s) => {
          if (s === 'hadir') return 'H';
          if (s === 'sakit') return 'S';
          if (s === 'izin') return 'I';
          if (s === 'alpha') return 'A';
          return 'H'; // Default fallback
        };

        const payloadArray = students.map(s => ({
          no_absen: s.number,
          status: formatStatus(attendance[s.id] || 'hadir')
        }));
        await submitAttendance(classData.sheetId, payloadArray);
        // Jika sukses kirim ke Sheets, simpan ke lokal juga
        doSaveToLocal();
        setShowModal(true);
      } catch (error) {
        alert("Gagal menyimpan ke server: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Jika offline
      if (isSubmittedToday) {
        setShowConfirmModal(true);
      } else {
        doSaveToLocal();
        setShowModal(true);
      }
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    if (!isOffline) {
      try {
        setIsSubmitting(true);
        const formatStatus = (s) => {
          if (s === 'hadir') return 'H';
          if (s === 'sakit') return 'S';
          if (s === 'izin') return 'I';
          if (s === 'alpha') return 'A';
          return 'H';
        };

        const payloadArray = students.map(s => ({
          no_absen: s.number,
          status: formatStatus(attendance[s.id] || 'hadir')
        }));
        await submitAttendance(classData.sheetId, payloadArray);
        doSaveToLocal();
        setShowModal(true);
      } catch (error) {
        alert("Gagal mengupdate ke server: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      doSaveToLocal();
      setShowModal(true);
    }
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
            <h3 className="stat-num">{students.length - Object.keys(attendance).length}</h3>
            <p className="stat-label" style={{ color: 'white' }}>Belum Absen</p>
          </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.15s', marginBottom: '16px' }}>
        <button onClick={handleMarkAllPresent} style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem' }}>
          <CheckSquare size={20} /> Tandai Semua Hadir
        </button>
      </div>

      <div className="student-list" style={{marginBottom: '80px'}}>
        {isLoadingStudents ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'white' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
            <h3 style={{ margin: '0 0 8px 0' }}>Menarik Daftar Siswa</h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.95rem' }}>Berkomunikasi dengan Google Sheets...</p>
          </div>
        ) : studentError ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'white', background: 'rgba(255,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <AlertCircle size={32} style={{ opacity: 0.8, margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0' }}>Gagal Memuat</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>{studentError}</p>
          </div>
        ) : (
          students.map((student, index) => (
            <div key={student.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
              <StudentListTile 
                student={student} 
                status={attendance[student.id]}
                onStatusChange={(status) => handleStatusChange(student.id, status)}
              />
            </div>
          ))
        )}
      </div>

      <div className="bottom-bar" style={{ background: 'rgba(255,255,255,0.15)', borderTopColor: 'rgba(255,255,255,0.2)' }}>
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={isLoadingStudents || students.length === 0 || isSubmitting}
          style={{ background: 'white', color: 'var(--text-main)' }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}><RefreshCw size={20} className="spin" /> Menyimpan...</span>
          ) : isSubmittedToday ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}><Send size={20} /> Update Perubahan</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}><Send size={20} /> Submit Kehadiran</span>
          )}
        </button>
      </div>
      
      <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmUpdate} />
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} isOffline={isOffline} />
    </div>
  );
}

export default AttendancePage;
