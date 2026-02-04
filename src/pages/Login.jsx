import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Sparkles, Camera } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, googleSignIn, demoLogin, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const result = await signIn(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      if (result.user?.uid) localStorage.setItem('foodsnap_uid', result.user.uid);
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await googleSignIn();
    setIsLoading(false);

    if (result.success) {
      if (result.user?.uid) localStorage.setItem('foodsnap_uid', result.user.uid);
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google sign-in failed.');
    }
  };

  const handleDemoLogin = () => {
    const result = demoLogin();
    if (result.user?.uid) localStorage.setItem('foodsnap_uid', result.user.uid);
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-surface to-background">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-2xl shadow-xl shadow-primary/10 backdrop-blur-sm border border-primary/20">
            <Camera className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
            <p className="text-text-muted">Sign in to continue your journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Sign In <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="px-4 text-sm text-text-muted">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Google Sign In */}
          <Button
            variant="secondary"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          {/* Demo Account Button */}
          <Button
            variant="ghost"
            onClick={handleDemoLogin}
            className="w-full mt-3 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Try Demo Account
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
