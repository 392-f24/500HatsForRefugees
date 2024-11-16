import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Navigationbar from './components/Navigation';

import LandingPage from './pages/LandingPage';
import ImpactPage from './pages/ImpactPage';
import VolunteerOpportunitiesPage from './pages/VolunteerOpportunitiesPage';
import AdminLogin from './pages/AdminLogin';
import AdminControlDashboard from './pages/AdminControlDashboard';

const App = () => {
  return (
    <Router>
      <div className="App-header">
        
        <Navigationbar />
        <div className="content flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/volunteerOpportunities" element={<VolunteerOpportunitiesPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/adminDashboard" element={<AdminControlDashboard />} />
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
