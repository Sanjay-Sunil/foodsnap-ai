import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Camera, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import TopBar from '../components/TopBar';
import { getUserPreferences } from '../utils/firebase';

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndLogPreferences = async () => {
      if (user?.uid) {
        try {
          // If selections aren't in memory, fetch from RTDB
          const prefs = await getUserPreferences(user.uid);
          if (prefs) {
            console.log("--- Dashboard User Preferences Log ---");
            console.log("Raw Preferences from RTDB:", prefs);
            console.log("Flattened Selections Array:", prefs.selections || "No selections array found");
            console.log("---------------------------------------");
          } else {
            console.log("No preferences found in RTDB for user:", user.uid);
          }
        } catch (err) {
          console.error("Error fetching preferences for logging:", err);
        }
      }
    };

    fetchAndLogPreferences();
  }, [user?.uid]);

  // Mock Data
  const dailyStats = {
    calories: 1250,
    goal: 2200,
    protein: 85,
    carbs: 140,
    fat: 45
  };

  const progress = (dailyStats.calories / dailyStats.goal) * 100;

  return (
    <div className="min-h-screen p-6 space-y-8 pb-24">
      <TopBar title={`Welcome, ${user?.name || 'User'}`} />

      {/* Main Stats Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 rounded-3xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/[0.03] relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg opacity-90">Daily Nutrition</h3>
          <Activity className="w-6 h-6 text-primary" />
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
              {i === 1 && (
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
