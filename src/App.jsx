import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Capture from './pages/Capture';
import Analysis from './pages/Analysis';
import Trends from './pages/Trends';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-text font-sans antialiased transition-colors duration-300 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/trends" element={<Trends />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
