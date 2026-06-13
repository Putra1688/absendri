import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { dummyClasses } from '../data/dummyData';

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

const weekdays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

function SchedulePage() {
  const navigate = useNavigate();

  const getDayCells = (day) => {
    let cells = [];
    let currentHour = 1;
    while (currentHour <= 10) {
      const cls = dummyClasses.find(c => c.schedule.some(s => s.day === day && s.start === currentHour));
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
      </div>
    </div>
  );
}

export default SchedulePage;
