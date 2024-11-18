import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Navigationbar from './components/Navigation';
//import AdminNavigationbar from './components/AdminNavigation'; // TO BE DONE

import LandingPage from './pages/LandingPage';
import ImpactPage from './pages/ImpactPage';
import VolunteerOpportunitiesPage from './pages/VolunteerOpportunitiesPage';
import AdminLogin from './pages/AdminLogin';
import AdminControlDashboard from './pages/AdminControlDashboard';
import '@fontsource/archivo';
import '@fontsource/archivo-black';


const App = () => {
  const location = useLocation();

  const showNavbar = !location.pathname.toLowerCase().includes('/adminlogin') &&
                     !location.pathname.toLowerCase().includes('/admindashboard');


  return (
    <div className="App-header">
      {showNavbar && <Navigationbar />}
      <div className="content flex-grow">
{/* <<<<<<< HEAD
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/volunteerOpportunities" element={<VolunteerOpportunitiesPage />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminControlDashboard />} />
        </Routes>
      </div>
======= */}
        <div className='body'>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/volunteerOpportunities" element={<VolunteerOpportunitiesPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/adminDashboard" element={<AdminControlDashboard />} />
          </Routes>
        </div>
     </div>
    </div>
  );
};

export default App;
