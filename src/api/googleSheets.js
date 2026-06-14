const API_URL = "https://script.google.com/macros/s/AKfycbxI2_SIRn8IHIaEBqe7xObyKweLwNKqO3g5ymOmMDJd7O-JCYrYZp3nUzxa-hfHewQE/exec";

export const fetchMasterData = async () => {
  try {
    const response = await fetch(`${API_URL}?action=get_master_data`);
    const result = await response.json();
    
    if (result.status === 'success') {
      // Simpan ke local storage untuk akses offline atau halaman lain
      localStorage.setItem('absendri_master_data', JSON.stringify(result.data));
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    // Jika offline atau error, coba baca dari cache local
    const cached = localStorage.getItem('absendri_master_data');
    if (cached) {
      console.log("Menggunakan data cache lokal (Offline Mode)");
      return JSON.parse(cached);
    }
    throw error;
  }
};

export const fetchStudents = async (sheetId) => {
  try {
    const response = await fetch(`${API_URL}?action=get_students&sheetId=${sheetId}`);
    const result = await response.json();
    
    if (result.status === 'success') {
      // Simpan backup lokal per kelas jika offline
      localStorage.setItem(`absendri_students_${sheetId}`, JSON.stringify(result.data));
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    const cached = localStorage.getItem(`absendri_students_${sheetId}`);
    if (cached) {
      console.log("Menggunakan data siswa cache lokal (Offline Mode)");
      return JSON.parse(cached);
    }
    throw error;
  }
};

export const fetchAlerts = async (sheetIds) => {
  if (!sheetIds || sheetIds.length === 0) return [];
  try {
    const idsString = sheetIds.join(',');
    const response = await fetch(`${API_URL}?action=get_alerts&sheetIds=${idsString}`);
    const result = await response.json();
    
    if (result.status === 'success') {
      localStorage.setItem('absendri_alerts', JSON.stringify(result.data));
      return result.data;
    }
    return []; // Fail silently and return empty
  } catch (error) {
    const cached = localStorage.getItem('absendri_alerts');
    if (cached) return JSON.parse(cached);
    return [];
  }
};

export const submitAttendance = async (sheetId, attendanceData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS membutuhkan text/plain untuk CORS yang aman
      },
      body: JSON.stringify({
        action: 'submit_attendance',
        sheetId: sheetId,
        attendanceData: attendanceData
      })
    });
    
    const result = await response.json();
    if (result.status === 'success') {
      return result;
    }
    throw new Error(result.message);
  } catch (error) {
    throw error;
  }
};
