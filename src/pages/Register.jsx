import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { ChevronRight, ChevronLeft, Check, User, Activity, Brain, Shield, Trophy, Gamepad2 } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What motivates you most?",
    options: [
      { text: "Leveling up and earning rewards", type: "gamer", icon: Gamepad2 },
      { text: "Learning about nutrition science", type: "learner", icon: Brain },
      { text: "Optimizing my athletic performance", type: "athlete", icon: Trophy },
      { text: "Managing a health condition", type: "navigator", icon: Shield },
    ]
  },
  {
    id: 2,
    question: "How do you want to view your food?",
    options: [
      { text: "As XP and Health Points", type: "gamer" },
      { text: "Detailed macro-nutrient breakdown", type: "athlete" },
      { text: "Traffic light system (Good/Bad)", type: "learner" },
      { text: "Safe vs Unsafe ingredients", type: "navigator" },
    ]
  }
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    goal: '',
    quizAnswers: []
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuizAnswer = (type) => {
    const newAnswers = [...formData.quizAnswers, type];
    setFormData({ ...formData, quizAnswers: newAnswers });

    if (newAnswers.length === QUIZ_QUESTIONS.length) {
      calculatePersona(newAnswers);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const calculatePersona = (answers) => {
    // Simple majority rule
    const counts = {};
    answers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const bestMatch = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

    // Mock API Call simulation
    setTimeout(() => {
      login({
        name: formData.name,
        persona: bestMatch,
        ...formData
      });
      navigate('/dashboard');
    }, 1500);
    setStep(4); // Loading/Calculating state
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-surface to-background transition-colors duration-500">
      <div className="w-full max-w-lg bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {step === 1 ? "Create Profile" : step <= 3 ? "Personalize" : "Analyzing..."}
          </h2>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none" placeholder="Alex Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface border border-gray-200 focus:ring-2 focus:ring-primary outline-none" placeholder="25" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface border border-gray-200 focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => setStep(2)}>
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {(step === 2 || step === 3) && (
            <motion.div
              key={`step${step}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-6">
                {QUIZ_QUESTIONS[step - 2].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {QUIZ_QUESTIONS[step - 2].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt.type)}
                    className="flex items-center p-4 text-left rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    {opt.icon && <opt.icon className="w-6 h-6 mr-4 text-text-muted group-hover:text-primary transition-colors" />}
                    <span className="font-medium text-text group-hover:text-primary transition-colors">{opt.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" /> {/* Need to import Loader2 or use lucide */}
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Finding your unique lens...</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Quick fix for missing import in the snippet above, adding it here to be robust
import { Loader2 } from 'lucide-react';

export default Register;
