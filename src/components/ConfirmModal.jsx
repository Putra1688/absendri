import { AlertCircle } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content animate-fade-in-up">
        <div className="modal-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)' }}>
          <AlertCircle size={48} color="white" />
        </div>
        <h2 className="modal-title">Konfirmasi Perubahan</h2>
        <p className="modal-message">
          Yakin mau simpan perubahan absensi untuk hari ini?
        </p>
        
        <div className="modal-actions">
          <button className="btn-primary" onClick={onConfirm} style={{ width: '100%', marginBottom: '12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            Ya, Simpan Perubahan
          </button>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
