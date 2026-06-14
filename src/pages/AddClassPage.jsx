import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Info } from 'lucide-react';

function AddClassPage() {
  const navigate = useNavigate();
  const masterSheetUrl = "https://docs.google.com/spreadsheets/d/17T61RbHBJKHrsnyxJR7FtxVYQOsGyeC_tIiZYU_Rjt4/edit?gid=0#gid=0";
  const templateUrl = "https://docs.google.com/spreadsheets/d/17NNODazFGO4QK6Sz6s5RiJVeS_CzMprInyWRvf2e6Rg/edit?gid=0#gid=0";

  return (
    <div className="page fade-in" style={{ paddingBottom: '40px' }}>
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
          Aplikasi PWA ini dirancang sebagai cermin pintar dari Google Sheets Anda. Ikuti 2 tahap singkat berikut untuk mendata kelas baru.
        </p>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--primary-color)', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--primary-color)', fontWeight: 'bold', textAlign: 'left' }}>Tahap 1: Buat Daftar Absen</p>
          <ol style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <li>Buka <a href={templateUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Template Kelas Ini</a>.</li>
            <li>Klik <b>File &gt; Make a copy</b>.</li>
            <li>Isi nama-nama murid di dalamnya.</li>
            <li>Lihat Link URL di atas browser Anda. Salin kombinasi kode huruf/angka yang terletak di antara <code>/d/</code> dan <code>/edit</code>. Itulah <b>ID Sheet Kelas</b> Anda!</li>
          </ol>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--primary-color)', marginBottom: '32px' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--primary-color)', fontWeight: 'bold', textAlign: 'left' }}>Tahap 2: Daftarkan ke Master</p>
          <ol style={{ margin: 0, paddingLeft: '20px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <li>Buka Tautan Master Spreadsheet di bawah.</li>
            <li>Pilih tab <b>Data_Kelas</b>.</li>
            <li>Isi nama kelas & <i>paste</i> ID Sheet Kelas tadi.</li>
            <li>Atur jadwalnya di tab <b>Jadwal_Mengajar</b>.</li>
            <li>Kembali ke PWA dan <i>refresh</i> layar!</li>
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
