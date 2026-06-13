import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';

function AddClassPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    sheetId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy validation logic
    alert(`Kelas ${formData.name} berhasil ditambahkan! (Mock)`);
    navigate('/');
  };

  return (
    <div className="page fade-in">
      <div className="header animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1>Tambah Kelas</h1>
          <p className="subtitle">Masukkan informasi kelas baru</p>
        </div>
      </div>

      <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nama Kelas</label>
            <input 
              type="text" 
              placeholder="Contoh: 10 IPA 1"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Tahun Ajaran</label>
            <input 
              type="text" 
              placeholder="Contoh: 2023/2024"
              required
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            />
          </div>
          <div className="input-group" style={{marginBottom: '24px'}}>
            <label>Google Spreadsheet ID</label>
            <input 
              type="text" 
              placeholder="1A2B3C..."
              required
              value={formData.sheetId}
              onChange={(e) => setFormData({...formData, sheetId: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-primary">
            <Save size={20} /> Simpan Kelas
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddClassPage;
