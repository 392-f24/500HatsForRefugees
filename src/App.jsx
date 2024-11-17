import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
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
  console.log('Current path:', location.pathname);

  let navbar;
  if (!['/adminlogin', '/admindashboard'].includes(location.pathname.toLowerCase())) {
    navbar = <Navigationbar />;
  }

  return (
    <div className="App-header">
      {navbar}
      <div className="content flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/volunteerOpportunities" element={<VolunteerOpportunitiesPage />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminControlDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
