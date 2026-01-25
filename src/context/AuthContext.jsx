import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [persona, setPersona] = useState(null); // 'gamer', 'learner', 'athlete', 'navigator'
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Apply persona theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (persona) {
      root.setAttribute('data-theme', persona);
    } else {
      root.removeAttribute('data-theme');
    }
  }, [persona]);

  // Apply dark mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const login = (userData) => {
    setUser(userData);
    if (userData.persona) setPersona(userData.persona);
  };

  const logout = () => {
    setUser(null);
    setPersona(null);
  };

  return (
    <AuthContext.Provider value={{ user, persona, setPersona, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
