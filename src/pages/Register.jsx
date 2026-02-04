import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveUserPreferences } from '../utils/firebase';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  Shield,
  Trophy,
  Gamepad2,
  Loader2,
  Camera,
  Activity,
  Heart,
  AlertTriangle,
  Zap,
  Check,
  MousePointer2,
  Sparkles,
  Settings2
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "The Medical Shield",
    subtext: "To provide safe alerts, are you managing any of the following conditions?",
    type: "multi",
    key: "medicalConditions",
    options: [
      { text: "Diabetes (Type 1 or 2)", sub: "Triggers alerts for high GI foods & carbs", icon: Activity, value: "diabetes" },
      { text: "Hypertension", sub: "Triggers alerts for high sodium/salt content", icon: Heart, value: "hypertension" },
      { text: "Celiac / Gluten Sensitivity", sub: "Flags bread, pasta, and hidden gluten", icon: AlertTriangle, value: "celiac" },
      { text: "Heart Disease / Cholesterol", sub: "Flags high saturated and trans fats", icon: Shield, value: "heart_disease" },
      { text: "PCOS / Metabolic Syndrome", sub: "Prioritizes fiber-to-carb ratios", icon: Zap, value: "pcos" },
      { text: "None / General Health", sub: "No specific medical tracking", icon: Sparkles, value: "none" },
    ]
  },
  {
    id: 2,
    question: "The Motivation Hook",
    subtext: "What’s your main goal with FoodSnap AI?",
    type: "single",
    key: "persona",
    options: [
      { text: '"I want to earn rewards and keep a streak."', persona: "gamer", icon: Gamepad2 },
      { text: '"I want to understand the nutrition in my meals."', persona: "learner", icon: Brain },
      { text: '"I need to hit specific calorie/macro targets."', persona: "athlete", icon: Trophy },
      { text: '"I need to manage a health condition (e.g., Diabetes)."', persona: "navigator", icon: Shield },
    ]
  },
  {
    id: 3,
    question: "The Knowledge Check",
    subtext: "How would you describe your nutrition knowledge?",
    type: "single",
    key: "knowledgeLevel",
    options: [
      { text: '"Total beginner—just show me the basics."', sub: "Simplified UI: Just Calories", value: "beginner" },
      { text: '"Intermediate—I know about Carbs/Protein/Fats."', sub: "Standard UI: Calories + Macros", value: "intermediate" },
      { text: '"Expert—I track everything down to the gram."', sub: "Advanced UI: Full Micronutrients", value: "expert" },
    ]
  },
  {
    id: 4,
    question: 'The "Red Flag" Filter',
    subtext: "Do you have any dietary restrictions or 'Red Flags' we should alert you to?",
    type: "multi",
    key: "dietaryRestrictions",
    options: [
      { text: "High Sugar/Glucose (Diabetic)", value: "high_sugar" },
      { text: "Gluten-Free (Celiac)", value: "gluten_free" },
      { text: "High Sodium (Hypertension)", value: "high_sodium" },
      { text: "Vegan / Vegetarian", value: "vegan" },
      { text: "None", value: "none" },
    ]
  },
  {
    id: 5,
    question: "The Friction Tolerance",
    subtext: "How much do you want to interact with the app after taking a photo?",
    type: "single",
    key: "interactionPreference",
    options: [
      { text: '"Hands-off: Just log it for me automatically."', sub: "High AI confidence logic", value: "hands_off" },
      { text: '"Collaborative: Ask me about hidden things like oils or sauces."', sub: "Enables smart prompts", value: "collaborative" },
      { text: '"Precise: I want to verify and edit every single item."', sub: "Force-opens review screen", value: "precise" },
    ]
  }
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, login, user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    quizAnswers: {
      medicalConditions: [],
      persona: '',
      knowledgeLevel: '',
      dietaryRestrictions: [],
      interactionPreference: ''
    }
  });

  // Pre-fill email from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [location]);

  // Redirect if already logged in and finished onboarding
  useEffect(() => {
    if (user && user.selections && step === 1) {
      navigate('/dashboard');
    }
  }, [user, navigate, step]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.age || formData.age <= 0) {
      setError('Please enter a valid age');
      return false;
    }
    if (!formData.gender) {
      setError('Please select your gender');
      return false;
    }
    return true;
  };

  const handleContinueToQuiz = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setError('');

    // Create Firebase account first
    const result = await signUp(formData.email, formData.password, formData.name);

    setIsLoading(false);

    if (result.success) {
      if (result.user?.uid) localStorage.setItem('foodsnap_uid', result.user.uid);
      setRegisteredUser(result.user);
      setStep(2); // Move to quiz
    } else {
      // Handle specific Firebase errors
      if (result.error.includes('email-already-in-use')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (result.error.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    }
  };

  const handleQuizAnswer = (key, value, type) => {
    const currentAnswers = { ...formData.quizAnswers };

    if (type === 'multi') {
      const existing = currentAnswers[key] || [];
      if (value === 'none') {
        currentAnswers[key] = existing.includes('none') ? [] : ['none'];
      } else {
        const withoutNone = existing.filter(v => v !== 'none');
        if (withoutNone.includes(value)) {
          currentAnswers[key] = withoutNone.filter(v => v !== value);
        } else {
          currentAnswers[key] = [...withoutNone, value];
        }
      }
    } else {
      currentAnswers[key] = value;
    }

    setFormData({ ...formData, quizAnswers: currentAnswers });

    // For single select, automatically advance to next step
    if (type === 'single') {
      if (step === QUIZ_QUESTIONS.length + 1) {
        calculatePersona(currentAnswers);
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleNextStep = () => {
    if (step === QUIZ_QUESTIONS.length + 1) {
      calculatePersona(formData.quizAnswers);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const calculatePersona = (answers) => {
    const finalAnswers = answers || formData.quizAnswers;
    const persona = finalAnswers.persona || 'learner';

    // Create a flat array of all selected options
    const allSelections = Object.entries(finalAnswers).flatMap(([key, value]) => {
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    });

    console.log("Raw Onboarding Answers:", finalAnswers);
    console.log("Flattened Selections Array:", allSelections);

    setStep(QUIZ_QUESTIONS.length + 2); // Final loading state

    const preferences = {
      name: formData.name,
      persona: persona,
      age: formData.age,
      gender: formData.gender,
      onboarding: finalAnswers,
      selections: allSelections,
      timestamp: new Date().toISOString()
    };

    // Update user profile with persona and save to RTDB
    setTimeout(async () => {
      try {
        const uid = user?.uid || registeredUser?.uid;
        console.log("Saving preferences for UID:", uid);

        if (uid) {
          await saveUserPreferences(uid, preferences);
        } else {
          console.warn("No UID found for saving preferences!");
        }

        login({ ...preferences, uid: uid });
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to save preferences:", err);
        // Still login and navigate even if RTDB fails (don't block user)
        login(preferences);
        navigate('/dashboard');
      }
    }, 1500);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-surface to-background transition-colors duration-500 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-primary/10 p-4 rounded-2xl shadow-xl shadow-primary/10 backdrop-blur-sm border border-primary/20">
            <Camera className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {step > 1 && step < 4 && (
                <button
                  onClick={goBack}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-text-muted" />
                </button>
              )}
              <h2 className="text-3xl font-bold text-primary">
                {step === 1 ? "Create Account" : step <= QUIZ_QUESTIONS.length + 1 ? "Personalize" : "Analyzing..."}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / (QUIZ_QUESTIONS.length + 2)) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-emerald-400"
              />
            </div>
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

          <AnimatePresence mode="wait">
            {/* Step 1: Registration Form */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContinueToQuiz();
                }}
              >
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Alex Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Min 6 characters"
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

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">Age</label>
                    <input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  isLoading={isLoading}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-text-muted mt-4">
                  Already have an account?{' '}
                  <span
                    onClick={() => navigate('/login')}
                    className="text-primary font-medium cursor-pointer hover:underline"
                  >
                    Sign in
                  </span>
                </p>
              </motion.form>
            )}

            {/* Quiz Questions */}
            {step > 1 && step <= QUIZ_QUESTIONS.length + 1 && (
              <motion.div
                key={`step${step}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-semibold text-text">
                    {QUIZ_QUESTIONS[step - 2].question}
                  </h3>
                  {QUIZ_QUESTIONS[step - 2].subtext && (
                    <p className="text-sm text-text-muted mt-1">
                      {QUIZ_QUESTIONS[step - 2].subtext}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {QUIZ_QUESTIONS[step - 2].options.map((opt, idx) => {
                    const key = QUIZ_QUESTIONS[step - 2].key;
                    const value = opt.value || opt.persona;
                    const isSelected = QUIZ_QUESTIONS[step - 2].type === 'multi'
                      ? formData.quizAnswers[key]?.includes(value)
                      : formData.quizAnswers[key] === value;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(key, value, QUIZ_QUESTIONS[step - 2].type)}
                        className={`flex items-center p-4 text-left rounded-xl border transition-all group ${isSelected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5'
                          }`}
                      >
                        <div className={`p-2 rounded-lg mr-4 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-muted group-hover:text-primary'
                          }`}>
                          {opt.icon ? <opt.icon className="w-5 h-5" /> : isSelected ? <Check className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-sm" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium transition-colors ${isSelected ? 'text-primary' : 'text-text group-hover:text-primary'}`}>
                            {opt.text}
                          </p>
                          {opt.sub && (
                            <p className="text-xs text-text-muted mt-0.5">{opt.sub}</p>
                          )}
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-primary ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {QUIZ_QUESTIONS[step - 2].type === 'multi' && (
                  <Button
                    className="w-full mt-4"
                    onClick={handleNextStep}
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </motion.div>
            )}

            {/* Final Loading State */}
            {step === QUIZ_QUESTIONS.length + 2 && (
              <motion.div
                key="loading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Personalizing your experience...
                </h3>
                <p className="text-text-muted mt-2">Setting up your nutrition dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
