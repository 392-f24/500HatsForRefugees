import React from 'react';
import { useAuthState } from '../utilities/firebase';
import { useDbData } from '../utilities/firebase';


const AdminProtectedRoute = ({ children }) => {
  const [user] = useAuthState(); // Get current user
  const [userData] = useDbData(user ? `admin/${user.uid}` : null); 

  if (!userData) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Access Denied</h1>
          <p>You need admin privileges to view this page.</p>
        </div>
        
      );
   
  }

  return children; // Render the page if authorized
};

export default AdminProtectedRoute;
