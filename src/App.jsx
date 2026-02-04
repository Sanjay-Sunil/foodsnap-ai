import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
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
            <Route path="/" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/capture" element={
              <ProtectedRoute>
                <Capture />
              </ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            } />
            <Route path="/trends" element={
              <ProtectedRoute>
                <Trends />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
