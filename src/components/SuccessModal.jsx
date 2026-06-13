import { CheckCircle2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ isOpen, onClose, isOffline }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content animate-fade-in-up">
        <div className="modal-icon-wrapper">
          <CheckCircle2 size={48} color="white" />
        </div>
        <h2 className="modal-title">Berhasil!</h2>
        <p className="modal-message">
          {isOffline 
            ? "Data absensi telah disimpan di HP Anda. Akan otomatis terkirim saat internet terhubung kembali."
            : "Data absensi hari ini telah berhasil disimpan."}
        </p>
        
        <div className="modal-actions">
          <button className="btn-primary" onClick={handleGoHome} style={{ width: '100%', marginBottom: '12px' }}>
            <Home size={20} /> Kembali ke Beranda
          </button>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
