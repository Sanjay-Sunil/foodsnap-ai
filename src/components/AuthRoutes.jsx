import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute: Only accessible by authenticated users.
 * Redirects to /login if not authenticated.
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const hasToken = localStorage.getItem('foodsnap_uid');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute: Only accessible by non-authenticated users (e.g., Login/Register).
 * Redirects to /dashboard if already authenticated.
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const hasToken = localStorage.getItem('foodsnap_uid');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user || hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
