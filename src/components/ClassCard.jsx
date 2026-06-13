import { Link } from 'react-router-dom';
import { Users, ChevronRight, BookOpen } from 'lucide-react';

function ClassCard({ classData, isCompleted }) {
  const themeColor = classData.color || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
  
  return (
    <Link to={`/attendance/${classData.id}`} state={{ classData }} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="glass-card class-card" style={{ background: themeColor, border: 'none', color: 'white' }}>
        <div className="class-icon-wrapper" style={{ background: 'rgba(255,255,255,0.25)', boxShadow: 'none' }}>
          <BookOpen size={24} color="white" />
        </div>
        <div className="class-info">
          <h3 className="class-name" style={{ color: 'white' }}>
            {classData.name}
            {isCompleted && <span style={{ marginLeft: '10px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '12px', verticalAlign: 'middle', fontWeight: 'bold' }}>✓ Selesai</span>}
          </h3>
          <p className="class-meta" style={{ color: 'rgba(255,255,255,0.9)' }}>
            <Users size={16} color="rgba(255,255,255,0.9)" /> {classData.studentCount} Siswa
          </p>
        </div>
        <div>
          <ChevronRight color="rgba(255,255,255,0.9)" />
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
