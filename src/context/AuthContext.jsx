import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  onAuthStateChanged,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  getUserPreferences
} from '../utils/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Demo user profile for instant demo access
const DEMO_USER = {
  uid: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@foodsnapai.com',
  persona: 'learner',
  isDemo: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [persona, setPersona] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('foodsnap_darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isDemo: false
        });
        localStorage.setItem('foodsnap_uid', firebaseUser.uid);
      } else {
        // User is signed out (but keep demo user if active)
        const isDemoActive = user?.isDemo;
        if (!isDemoActive) {
          setUser(null);
          localStorage.removeItem('foodsnap_uid');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch preferences once logged in
  useEffect(() => {
    const fetchPrefs = async () => {
      if (user?.uid && !user.isDemo && !user.selections) {
        try {
          const prefs = await getUserPreferences(user.uid);
          if (prefs) {
            setUser(prev => ({ ...prev, ...prefs }));
            if (prefs.persona) setPersona(prefs.persona);
          }
        } catch (err) {
          console.error("Error fetching preferences in AuthContext:", err);
        }
      }
    };
    fetchPrefs();
  }, [user?.uid]);


  // Apply dark mode class and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('foodsnap_darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Sign up with email/password
  const signUp = async (email, password, displayName) => {
    setAuthError(null);
    try {
      const firebaseUser = await signUpWithEmail(email, password, displayName);
      setUser({
        uid: firebaseUser.uid,
        name: displayName,
        email: firebaseUser.email,
        isDemo: false
      });
      return { success: true, user: firebaseUser };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    setAuthError(null);
    try {
      const firebaseUser = await signInWithEmail(email, password);
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        isDemo: false
      });
      return { success: true, user: firebaseUser };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const googleSignIn = async () => {
    setAuthError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        isDemo: false
      });
      return { success: true, user: firebaseUser };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Demo login (no Firebase - instant access)
  const demoLogin = () => {
    setUser(DEMO_USER);
    setPersona(DEMO_USER.persona);
    return { success: true, user: DEMO_USER };
  };

  // Login function for quiz completion (sets persona)
  const login = (userData) => {
    setUser((prev) => ({
      ...prev,
      ...userData
    }));
    if (userData.persona) setPersona(userData.persona);
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem('foodsnap_uid');
    if (user?.isDemo) {
      setUser(null);
      setPersona(null);
    } else {
      await logOut();
      setUser(null);
      setPersona(null);
    }
  };

  const value = {
    user,
    persona,
    setPersona,
    login,
    logout,
    darkMode,
    toggleDarkMode,
    loading,
    authError,
    signUp,
    signIn,
    googleSignIn,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
