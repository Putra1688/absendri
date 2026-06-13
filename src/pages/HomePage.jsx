import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, WifiOff, Wifi, AlertTriangle, CalendarDays } from 'lucide-react';
import ClassCard from '../components/ClassCard';
import { dummyClasses, dummyAlerts } from '../data/dummyData';

function HomePage() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [absensiData, setAbsensiData] = useState({});

  const todayIndex = new Date().getDay();
  const daysString = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayString = daysString[todayIndex];

  // Khusus prototype: Jika ini hari Sabtu/Minggu (saat testing), kita bisa tampilkan hari "Senin" secara statis,
  // tapi lebih baik ikuti hari asli sesuai logika yang diminta user.
  const todaysClasses = dummyClasses.filter(cls => 
    cls.schedule.some(s => s.day === todayString)
  );

  useEffect(() => {
    // Load status absensi
    const savedData = JSON.parse(localStorage.getItem('absensiData') || '{}');
    setAbsensiData(savedData);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="page">
      <div className="app-bar animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="greeting-section">
          <p className="greeting-text">Assalamualaikum,</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="greeting-name">Ustadz Adri 🙏</h1>
            {isOffline ? (
              <div className="offline-badge">
                <WifiOff size={14} /> Offline
              </div>
            ) : (
              <div className="offline-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}>
                <Wifi size={14} /> Online
              </div>
            )}
          </div>
        </div>
        
      </div>
      
      <div className="dashboard-summary animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="stat-card">
          <h3 className="stat-num">{todaysClasses.length}</h3>
          <p className="stat-label">Kelas Hari Ini</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-num">{dummyClasses.length}</h3>
          <p className="stat-label">Total Kelas</p>
        </div>
      </div>

      <div className="schedule-header animate-fade-in-up" style={{ animationDelay: '0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>Jadwal Hari Ini</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/schedule" style={{ textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', color: 'var(--primary-color)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)' }}>
            <CalendarDays size={16} /> Lihat Semua
          </button>
        </Link>
      </div>
      
      <div className="class-list">
        {todaysClasses.length > 0 ? (
          todaysClasses.map((cls, index) => {
            const today = new Date().toLocaleDateString('id-ID');
            const isCompleted = absensiData[cls.id] && absensiData[cls.id].date === today;
            
            return (
              <div key={cls.id} className="animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <ClassCard classData={cls} isCompleted={isCompleted} />
              </div>
            );
          })
        ) : (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 20px', animationDelay: '0.2s' }}>
            <CalendarDays size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Alhamdulillah!</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>Anda tidak memiliki jadwal mengajar hari ini. Selamat beristirahat atau selamat mengerjakan tugas lainnya!</p>
          </div>
        )}
      </div>

      <div className="section-header animate-fade-in-up" style={{ animationDelay: '0.4s', marginTop: '32px' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} color="var(--status-sakit)" /> Perhatian Khusus
        </h2>
      </div>

      <div className="alert-list">
        {dummyAlerts.map((alert, index) => (
          <div key={alert.id} className={`alert-tile ${alert.type} animate-fade-in-up`} style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
            <div className="alert-info">
              <h4 className="alert-name">{alert.name}</h4>
              <p className="alert-meta">{alert.className}</p>
            </div>
            <div className={`alert-badge ${alert.type}`}>
              {alert.status}
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-bar">
        <Link to="/add-class" style={{textDecoration: 'none'}}>
          <button className="btn-primary">
            <Plus size={20} /> Tambah Kelas Baru
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
