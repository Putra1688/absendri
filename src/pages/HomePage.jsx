import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, WifiOff, Wifi, AlertTriangle, CalendarDays, Loader2, CheckCircle2, BookOpen } from 'lucide-react';
import ClassCard from '../components/ClassCard';
import { fetchMasterData, fetchAlerts } from '../api/googleSheets';

const ISLAMIC_QUOTES = [
  { text: "Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah mudahkan baginya jalan menuju Surga.", source: "HR. Muslim" },
  { text: "Sesungguhnya Allah, para malaikat-Nya, penduduk langit dan bumi... bershalawat kepada orang yang mengajarkan kebaikan kepada manusia.", source: "HR. Tirmidzi" },
  { text: "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya.", source: "HR. Bukhari" },
  { text: "Pendidikan terbaik adalah hadiah terindah orang tua untuk anaknya, dan gurulah yang menjembatani hadirnya hadiah mulia tersebut di dunia.", source: "Inspirasi HR. Tirmidzi" },
  { text: "Saat kita sibuk menjaga harta yang bisa habis, seorang guru justru menanamkan ilmu—sesuatu yang akan menjaga muridnya seumur hidup dan mengalirkan pahala abadi.", source: "Inspirasi Ali bin Abi Thalib" },
  { text: "Harta yang kita tumpuk akan habis, namun ilmu yang guru tanamkan di hati para murid adalah investasi abadi yang tak akan pernah lekang oleh waktu.", source: "Inspirasi Ali bin Abi Thalib" },
  { text: "Setiap kali seorang anak tumbuh menjadi pribadi yang beradab dan berilmu, di sana ada jejak ketulusan guru yang merealisasikan titipan terbaik para orang tua.", source: "Inspirasi HR. Tirmidzi" },
  { text: "Menjadi guru berarti memilih untuk menjaga dan merawat sesuatu yang jauh lebih berharga dari permata, yaitu masa depan dan pelita hidup generasi penerus.", source: "Inspirasi Ali bin Abi Thalib" },
  { text: "Pendidikan yang baik adalah warisan paling utama, dan para gurulah sang arsitek yang merajut warisan tersebut ke dalam jiwa setiap anak didik.", source: "Inspirasi HR. Tirmidzi" },
  { text: "Pekerjaan lain mungkin menghasilkan materi, tetapi seorang guru membagikan ilmu—warisan yang akan terus hidup, membimbing, dan menjaga muridnya bahkan saat guru telah tiada.", source: "Inspirasi Ali bin Abi Thalib" }
];

function HomePage() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [absensiData, setAbsensiData] = useState({});
  const [classes, setClasses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(ISLAMIC_QUOTES[0]);

  const todayIndex = new Date().getDay();
  const daysString = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayString = daysString[todayIndex];

  const todaysClasses = classes.filter(cls =>
    cls.schedule && cls.schedule.some(s => s.day === todayString)
  );

  useEffect(() => {
    // Pilih quote acak
    setQuoteOfTheDay(ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)]);

    // Load status absensi
    const savedData = JSON.parse(localStorage.getItem('absensiData') || '{}');
    setAbsensiData(savedData);

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMasterData();
        setClasses(data);
        setErrorMsg(null);

        // Panggil detektif untuk memuat alerts (Terpisah, tidak memblokir UI)
        loadAlerts(data);
      } catch (err) {
        setErrorMsg('Gagal mengambil data dari server. Pastikan Anda terhubung ke internet.');
        setIsLoadingAlerts(false);
      } finally {
        setIsLoading(false);
      }
    };

    const loadAlerts = async (classList) => {
      try {
        setIsLoadingAlerts(true);
        // Ambil sheetId dari kelas yang ada hari ini (atau semua kelas jika mau lebih menyeluruh)
        const sheetIdsToSearch = classList.map(c => c.sheetId).filter(id => id);

        if (sheetIdsToSearch.length > 0) {
          const alertData = await fetchAlerts(sheetIdsToSearch);
          setAlerts(alertData);
        } else {
          setIsLoadingAlerts(false);
        }
      } catch (e) {
        console.error("Gagal menarik alerts", e);
      } finally {
        setIsLoadingAlerts(false);
      }
    };

    loadData();

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
          <h3 className="stat-num">{isLoading ? '-' : todaysClasses.length}</h3>
          <p className="stat-label">Kelas Hari Ini</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-num">{isLoading ? '-' : classes.length}</h3>
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
        {isLoading ? (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 20px', animationDelay: '0.2s' }}>
            <Loader2 size={32} color="var(--primary-color)" className="spin" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Sinkronisasi Data</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Mengambil jadwal dari Google Sheets...</p>
          </div>
        ) : errorMsg && classes.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 20px', animationDelay: '0.2s', borderLeft: '4px solid var(--status-sakit)' }}>
            <AlertTriangle size={32} color="var(--status-sakit)" style={{ opacity: 0.8, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Koneksi Gagal</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{errorMsg}</p>
          </div>
        ) : todaysClasses.length > 0 ? (
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
        {isLoadingAlerts ? (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '30px 20px', animationDelay: '0.5s' }}>
            <Loader2 size={24} color="var(--status-sakit)" className="spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mendeteksi data siswa...</p>
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={alert.id} className={`alert-tile ${alert.type} animate-fade-in-up`} style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
              <div className="alert-info">
                <h4 className="alert-name">{alert.name}</h4>
                <p className="alert-meta">{alert.className}</p>
              </div>
              <div className={`alert-badge ${alert.type}`}>
                {alert.status}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '30px 20px', animationDelay: '0.5s', borderLeft: '4px solid var(--status-hadir)' }}>
            <CheckCircle2 size={32} color="var(--status-hadir)" style={{ opacity: 0.8, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>Semua Aman Terkendali!</h3>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Alhamdulillah, tidak ada siswa yang absen berturut-turut pada 3 pertemuan terakhir.
            </p>
          </div>
        )}
      </div>

      <div className="section-header animate-fade-in-up" style={{ animationDelay: '0.6s', marginTop: '32px' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
          <BookOpen size={20} /> Penyemangat Hari Ini
        </h2>
      </div>

      <div className="glass-card animate-fade-in-up" style={{ padding: '24px 20px', animationDelay: '0.7s', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)', border: '1px solid rgba(99, 102, 241, 0.15)', marginBottom: '80px' }}>
        <p style={{ fontStyle: 'italic', margin: '0 0 12px 0', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'center' }}>
          "{quoteOfTheDay.text}"
        </p>
        <p style={{ margin: 0, color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>
          — {quoteOfTheDay.source}
        </p>
      </div>

      <div className="bottom-bar">
        <Link to="/add-class" style={{ textDecoration: 'none' }}>
          <button className="btn-primary">
            <Plus size={20} /> Tambah Kelas Baru
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
