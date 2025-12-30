import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import HistoryPage from './pages/HistoryPage/HistoryPage'; 

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/auth" element={<AuthPage />} />
        
      
        <Route path="/dashboard" element={<DashboardPage />} />
        
      
        <Route path="/history" element={<HistoryPage />} /> 
        
        {/* הפניה אוטומטית: כל כתובת לא מוכרת תעבור לדף ההתחברות */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;