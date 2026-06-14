import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Info } from 'lucide-react';

function AddClassPage() {
  const navigate = useNavigate();
  const masterSheetUrl = "https://docs.google.com/spreadsheets/d/17T61RbHBJKHrsnyxJR7FtxVYQOsGyeC_tIiZYU_Rjt4/edit?gid=0#gid=0";

  return (
    <div className="page fade-in">
      <div className="header animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1>Tambah Kelas</h1>
          <p className="subtitle">Integrasi Master Data</p>
        </div>
      </div>

      <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.2s', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
          <Info size={40} color="var(--primary-color)" />
        </div>
        
        <h2 style={{ margin: '0 0 12px 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>Terkoneksi Otomatis</h2>
        
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Aplikasi PWA ini dirancang sebagai cermin pintar dari Master Spreadsheet Anda. Untuk menambah kelas baru, murid baru, ataupun mengubah jadwal mengajar, silakan atur langsung melalui Google Sheets.
        </p>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--primary-color)', marginBottom: '32px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold', textAlign: 'center' }}>Panduan Menambah Kelas:</p>
          <ol style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <li>Buka Tautan Master Spreadsheet di bawah.</li>
            <li>Pilih tab <b>Data_Kelas</b> di bagian bawah layar.</li>
            <li>Isi nama kelas dan ID pada baris kosong.</li>
            <li>Buka kembali PWA ini dan *refresh* halaman.</li>
          </ol>
        </div>

        <a href={masterSheetUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', width: '100%' }}>
            Buka Master Spreadsheet <ExternalLink size={20} />
          </button>
        </a>
      </div>
    </div>
  );
}

export default AddClassPage;
