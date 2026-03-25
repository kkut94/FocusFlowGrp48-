import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './screens/landingPage';
import AuthenticationPage from './screens/AuthenticationPage';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;