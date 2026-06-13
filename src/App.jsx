import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddClassPage from './pages/AddClassPage';
import AttendancePage from './pages/AttendancePage';
import SchedulePage from './pages/SchedulePage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-class" element={<AddClassPage />} />
          <Route path="/attendance/:classId" element={<AttendancePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
