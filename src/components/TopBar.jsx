import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronLeft } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const TopBar = ({ title, showBack = false, showUser = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted" />
          </button>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-surface border border-gray-100 dark:border-gray-800 text-text-muted hover:text-danger hover:border-danger/20 transition-all shadow-sm"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
        {showUser && user && (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ml-1">
            <span className="text-lg font-bold text-primary">{user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
