import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Camera, AlertTriangle, Zap, TrendingUp, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';

const Dashboard = () => {
  const { user, persona } = useAuth();

  // Mock Data
  const dailyStats = {
    calories: 1250,
    goal: 2200,
    protein: 85,
    carbs: 140,
    fat: 45
  };

  // Persona Content Config
  const personaConfig = {
    gamer: {
      greeting: "Welcome back, Player!",
      statsTitle: "Daily XP",
      cardStyle: "border-primary bg-black/40",
      icon: Zap
    },
    learner: {
      greeting: "Ready to learn?",
      statsTitle: "Nutrition Balance",
      cardStyle: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30",
      icon: TrendingUp
    },
    athlete: {
      greeting: "Let's hit those macros.",
      statsTitle: "Fuel Tank",
      cardStyle: "bg-slate-900 border-slate-800 text-white",
      icon: Activity
    },
    navigator: {
      greeting: "Health Monitor Active",
      statsTitle: "Daily Limit",
      cardStyle: "bg-blue-50 border-blue-100 dark:bg-blue-950/20",
      icon: Activity
    }
  };

  const config = personaConfig[persona] || personaConfig.learner;
  const progress = (dailyStats.calories / dailyStats.goal) * 100;

  return (
    <div className="min-h-screen p-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.greeting}</h1>
          <p className="text-text-muted">{user?.name || "Guest"}</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{user?.name?.[0] || "U"}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${config.cardStyle}`}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg opacity-90">{config.statsTitle}</h3>
          <config.icon className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold">{dailyStats.calories}</span>
          <span className="text-sm opacity-70 mb-2">/ {dailyStats.goal} kcal</span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
          />
        </div>

        {/* Macros */}
        <div className="flex justify-between mt-6 text-center">
          <div className="flex flex-col">
            <span className="text-xs opacity-70">Protein</span>
            <span className="font-bold">{dailyStats.protein}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs opacity-70">Carbs</span>
            <span className="font-bold">{dailyStats.carbs}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs opacity-70">Fats</span>
            <span className="font-bold">{dailyStats.fat}g</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Meals Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text">Recent Meals</h3>
        <div className="space-y-4">
          {/* Mock Meal Items */}
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium">Grilled Chicken Salad</h4>
                <p className="text-sm text-text-muted">Lunch • 450 kcal</p>
              </div>
              {/* Conditional Rendering for Navigator Persona */}
              {persona === 'navigator' && i === 1 && (
                <div className="flex flex-col items-end text-right">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="text-[10px] text-warning font-medium">Sodium High</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};


export default Dashboard;
