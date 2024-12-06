import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/Buttons.css'

import Navigationbar from './components/Navigation';
import AdminNavBar from './components/AdminNavBar';
import Footer from './components/Footer'; 


import LandingPage from './pages/LandingPage';
import ImpactPage from './pages/ImpactPage';
import VolunteerOpportunitiesPage from './pages/VolunteerOpportunitiesPage';
import AdminLogin from './pages/AdminLogin';
import AdminControlDashboard from './pages/AdminControlDashboard';
import '@fontsource/archivo';
import '@fontsource/archivo-black';
import InboxPage from './pages/InboxPage';

import LoginPage from './pages/UserLogin'
import SignUpPage from './pages/UserSignUp'
import AdminProtectedRoute from './components/AdminProtectedRoute';

import EventsPage from './pages/EventsPage';
import DonationPage from './pages/DonationPage';


const App = () => {
  return (
    <div className="App-header">

      <Navigationbar />
      <div className="content flex-grow">
        <div className="body">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/volunteerOpportunities" element={<VolunteerOpportunitiesPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signUp" element={<SignUpPage />} />

            {/* Admin-Protected Routes */}
            <Route
              path="/events"
              element={
                <AdminProtectedRoute>
                  <EventsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/adminDashboard/*"
              element={
                <AdminProtectedRoute>
                  <AdminControlDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <AdminProtectedRoute>
                  <InboxPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/donations"
              element={
                <AdminProtectedRoute>
                  <DonationPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
        
     </div>
     
    </div>
  );
};

export default App;