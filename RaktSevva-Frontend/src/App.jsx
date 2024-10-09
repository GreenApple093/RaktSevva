import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import HospitalDashboard from './components/HospitalDashboard';
import Register from './components/RegistrationPage';
import BloodBankDashboard from './components/BloodBankDashboard';
import LandingPage from './components/LandingPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/blood-bank-dashboard" element={<BloodBankDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
