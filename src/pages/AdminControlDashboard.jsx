// AdminControlDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './AdminControlDashboard.css';
import Graph from '../components/DashboardComponents/Graph';
import DonationsPage from '../components/DashboardComponents/DonationsPage';
import EventsPage from '../components/DashboardComponents/EventsPage';

const AdminControlDashboard = () => {
  const location = useLocation(); // Hook to get the current path
  const [animationKey, setAnimationKey] = useState(0); 

  useEffect(() => {
    // Increment the animation key to reset and replay the animation whenever the location changes
    setAnimationKey(prevKey => prevKey + 1);
  }, [location.pathname]); // Dependency on the current path
  
  return (
    <div className="admin-dashboard-container">
      <aside className="admin-nav">
        <header className="admin-header">
          <div style={{ marginLeft: '20px' }}>Hi!</div>
          <div style={{ marginTop: '10px', marginLeft: '50px' }}>Margie</div>
        </header>
        <div className="separator-line"></div>
        <ul key={animationKey}> 
          <li className={location.pathname === '/adminDashboard' ? 'active' : ''}>
            <Link to="/adminDashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className={location.pathname === '/adminDashboard/donations' ? 'active' : ''}>
            <Link to="/adminDashboard/donations" className="nav-link">Donations</Link>
          </li>
          <li className={location.pathname === '/adminDashboard/events' ? 'active' : ''}>
            <Link to="/adminDashboard/events" className="nav-link">Events</Link>
          </li>
          <li>future goal</li>
          <li>future goal</li>
        </ul>
      </aside>
      <div className="admin-main-content">
        <Routes>
          <Route path="/" element={<Graph />} /> {/* Displays the Graph by default */}
          <Route path="donations" element={<DonationsPage />} />
          <Route path="events" element={<EventsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminControlDashboard;
