import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { Camera, AlertTriangle, Activity, ChevronDown, Utensils, Calendar } from 'lucide-react';
import TopBar from '../components/TopBar';
import { getMealHistory } from '../utils/firebase';

const Dashboard = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      if (user?.uid) {
        try {
          const history = await getMealHistory(user.uid);
          if (history) {
            // Convert object to array and sort by date/time (newest first)
            const mealArray = Object.entries(history).map(([id, data]) => ({
              id,
              ...data
            })).sort((a, b) => {
              // Priority: date descending, then time descending if available
              const dateA = new Date(a.details?.date || 0);
              const dateB = new Date(b.details?.date || 0);
              return dateB - dateA;
            });
            setMeals(mealArray);
          }
        } catch (err) {
          console.error("Error fetching meal history:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMeals();
  }, [user?.uid]);

  const toggleAccordion = (id) => {
    setExpandedMeal(expandedMeal === id ? null : id);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    if (score >= 5) return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
  };

  const getScoreDotColor = (score) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Calculate today's stats
  const today = new Date().toLocaleDateString();
  const todayMeals = meals.filter(m => m.details?.date === today);
  const dailyStats = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.overall_breakdown?.total_calories || 0),
    protein: acc.protein + (meal.overall_breakdown?.total_protien || 0),
    carbs: acc.carbs + (meal.overall_breakdown?.total_carbs || 0),
    fat: acc.fat + (meal.overall_breakdown?.total_fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const goal = 2200;
  const progress = Math.min((dailyStats.calories / goal) * 100, 100);

  return (
    <div className="min-h-screen p-6 space-y-8 pb-24 bg-surface/30">
      <TopBar title={`Welcome, ${user?.displayName || user?.name || 'User'}`} />

      {/* Main Stats Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-xl shadow-black/[0.03] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg opacity-90">Today's Progress</h3>
          <Activity className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-black">{Math.round(dailyStats.calories)}</span>
          <span className="text-sm font-bold opacity-50 mb-1.5">/ {goal} kcal</span>
        </div>

        <div className="h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full bg-primary shadow-[0_0_12px_rgba(var(--color-primary),0.4)]`}
          />
        </div>

        <div className="flex justify-between mt-6">
          {[
            { label: 'Protein', value: dailyStats.protein, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Carbs', value: dailyStats.carbs, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Fats', value: dailyStats.fat, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          ].map((macro) => (
            <div key={macro.label} className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">{macro.label}</span>
              <div className={`px-3 py-1 rounded-lg ${macro.bg} ${macro.color} font-bold text-sm`}>
                {Math.round(macro.value)}g
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Meals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-text">Recent Meals</h3>
          <Calendar className="w-5 h-5 opacity-30" />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
            <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-text-muted font-medium">No meals logged yet today</p>
            <p className="text-xs text-text-muted mt-1">Capture your first meal to start tracking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="group">
                <motion.div
                  layout
                  onClick={() => toggleAccordion(meal.id)}
                  className={`relative overflow-hidden cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${expandedMeal === meal.id
                    ? 'bg-white dark:bg-zinc-900 shadow-lg border-black/5'
                    : 'bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 border-transparent hover:border-black/5'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Meal Image/Icon */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/5 flex-shrink-0">
                      {meal.details?.['image-url'] ? (
                        <img
                          src={meal.details['image-url']}
                          alt="Meal"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Utensils className="w-6 h-6 opacity-20" />
                        </div>
                      )}
                    </div>

                    {/* Meal Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg leading-tight">{meal.details?.['meal-type'] || 'Meal'}</h4>
                          <p className="text-xs font-bold text-text-muted opacity-60 mt-0.5">{meal.details?.time}</p>
                        </div>
                        <span className="text-[10px] font-black text-text-muted opacity-40 uppercase tracking-tighter self-start mt-1">
                          {meal.details?.date === today ? 'Today' : meal.details?.date}
                        </span>
                      </div>

                      {/* Nutrient Summary Row */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.03] px-2 py-1 rounded-lg border border-black/5 dark:border-white/5">
                          <div className={`w-1.5 h-1.5 rounded-full ${getScoreDotColor(meal.overall_breakdown?.health_score || 0)}`} />
                          <span className="text-[10px] font-black opacity-60 uppercase tracking-tighter">
                            {meal.overall_breakdown?.total_calories?.toFixed(0)} kcal
                          </span>
                        </div>

                        <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter shadow-sm shadow-emerald-500/5">
                          Protein: {meal.overall_breakdown?.total_protien?.toFixed(0)}g
                        </div>
                        <div className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter shadow-sm shadow-amber-500/5">
                          Carbs: {meal.overall_breakdown?.total_carbs?.toFixed(0)}g
                        </div>
                        <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter shadow-sm shadow-rose-500/5">
                          Fats: {meal.overall_breakdown?.total_fats?.toFixed(0)}g
                        </div>
                      </div>
                    </div>

                    <ChevronDown className={`w-5 h-5 opacity-20 transition-transform duration-300 ${expandedMeal === meal.id ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {expandedMeal === meal.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40 px-1">Items Included</p>
                          {meal.item?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02] p-3 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                  {item.image_url ? (
                                    <img src={item.image_url} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <Utensils className="w-4 h-4 opacity-20" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-bold capitalize">{item.food_item}</p>
                                  <p className="text-[10px] text-text-muted opacity-60">{item.quantity} {item.unit}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black">{Math.round(item.estimated_calories)} kcal</span>
                              </div>
                            </div>
                          ))}

                          {/* Health Score Banner */}
                          <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between ${getScoreColor(meal.overall_breakdown?.health_score || 0)}`}>
                            <div className="flex items-center gap-3 text-sm font-bold">
                              <Activity className="w-5 h-5" />
                              Health Score
                            </div>
                            <span className="text-xl font-black">{meal.overall_breakdown?.health_score}/10</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
