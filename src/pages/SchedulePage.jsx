import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { fetchMasterData } from '../api/googleSheets';

const hours = [
  { id: 1, label: 'JAM 1', time: '7:00 - 7:45' },
  { id: 2, label: 'JAM 2', time: '7:45 - 8:30' },
  { id: 3, label: 'JAM 3', time: '8:30 - 9:15' },
  { id: 4, label: 'JAM 4', time: '9:30 - 10:15' },
  { id: 5, label: 'JAM 5', time: '10:15 - 11:00' },
  { id: 6, label: 'JAM 6', time: '11:00 - 11:45' },
  { id: 7, label: 'JAM 7', time: '12:15 - 13:00' },
  { id: 8, label: 'JAM 8', time: '13:00 - 13:45' },
  { id: 9, label: 'JAM 9', time: '13:45 - 14:30' },
  { id: 10, label: 'JAM 10', time: '14:30 - 15:15' },
];

const weekdays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function SchedulePage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Bisa ambil dari network atau cache
        const data = await fetchMasterData();
        setClasses(data);
      } catch (err) {
        setErrorMsg('Gagal memuat jadwal dari server.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getDayCells = (day) => {
    let cells = [];
    let currentHour = 1;
    while (currentHour <= 10) {
      const cls = classes.find(c => c.schedule && c.schedule.some(s => s.day === day && s.start === currentHour));
      if (cls) {
        const schedule = cls.schedule.find(s => s.day === day && s.start === currentHour);
        const span = schedule.end - schedule.start + 1;
        cells.push({ id: `${day}-${currentHour}`, type: 'class', data: cls, span });
        currentHour += span;
      } else {
        cells.push({ id: `${day}-${currentHour}`, type: 'empty', span: 1 });
        currentHour += 1;
      }
    }
    return cells;
  };

  return (
    <div className="page" style={{ padding: '0' }}>
      <div className="app-bar" style={{ padding: '24px 20px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="back-btn" onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', color: 'var(--text-main)', padding: '10px' }}>
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Jadwal Lengkap</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Teacher AHMAD ADRI MUBAROK</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 80px 20px' }}>
        {isLoading ? (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Loader2 size={32} color="var(--primary-color)" className="spin" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Sinkronisasi Jadwal</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Mengambil data terbaru...</p>
          </div>
        ) : errorMsg && classes.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ textAlign: 'center', padding: '40px 20px', borderLeft: '4px solid var(--status-sakit)' }}>
            <AlertTriangle size={32} color="var(--status-sakit)" style={{ opacity: 0.8, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>Koneksi Gagal</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{errorMsg}</p>
          </div>
        ) : (
          <div className="schedule-wrapper animate-fade-in-up">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="sticky-col">Hari</th>
                  {hours.map(h => (
                    <th key={h.id}>
                      <div className="jam-label">{h.label}</div>
                      <div className="jam-time">{h.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekdays.map(day => (
                  <tr key={day}>
                    <td className="sticky-col day-label">{day}</td>
                    {getDayCells(day).map(cell => {
                      if (cell.type === 'empty') {
                        return <td key={cell.id}></td>;
                      } else {
                        return (
                          <td key={cell.id} colSpan={cell.span} className="class-cell-container">
                            <div className="class-cell" style={{ background: cell.data.color }}>
                              <div className="class-name">{cell.data.name}</div>
                            </div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;
