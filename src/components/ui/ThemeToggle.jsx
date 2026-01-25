import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ThemeToggle = ({ className }) => {
  const { darkMode, toggleDarkMode } = useAuth();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleDarkMode}
      className={`p-2 rounded-full bg-surface border border-gray-200 dark:border-gray-700 hover:bg-primary/10 transition-colors ${className}`}
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
