import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Info, AlertTriangle, Loader2, TrendingUp, Utensils, Target, Camera } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { image, imageUrl, analysis } = location.state || {};

  useEffect(() => {
    if (!analysis) {
      navigate('/capture');
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-text-muted">Wait a moment, we are getting your results...</p>
      </div>
    );
  }

  const detectedItems = analysis.detected_items || [];
  const summary = analysis.summary || {};
  const feedback = analysis.persona_feedback || {};

  const chartData = [
    { name: 'Protein', value: summary.protein_estimate_g || 0, color: '#3B82F6' },
    { name: 'Carbs', value: summary.carbs_estimate_g || 0, color: '#F59E0B' },
    { name: 'Fat', value: summary.fat_estimate_g || 0, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const getCalorieColor = (calories, confidence) => {
    if (!confidence || confidence > 0.8) {
      if (calories < 200) return 'text-emerald-500 bg-emerald-500/10';
      if (calories < 500) return 'text-amber-500 bg-amber-500/10';
      return 'text-rose-500 bg-rose-500/10';
    }
    return 'text-text-muted bg-surface';
  };

  const getMatchColor = (confidence) => {
    if (confidence > 0.8) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (confidence > 0.5) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    return 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="min-h-screen bg-surface p-6 pb-24 font-sans text-text transition-all duration-500">
      <TopBar title="Food Scan" showBack={true} />

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-black/5 border border-black/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full h-48 md:w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl xs:text-2xl md:text-3xl font-black text-primary leading-none">
                  {summary.estimated_total_calories}
                </span>
                <span className="text-[8px] xs:text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">
                  KCAL
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-surface border border-black/5 flex flex-col">
                <span className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Protein
                </span>
                <span className="text-xl font-bold">{summary.protein_estimate_g}g</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-black/5 flex flex-col">
                <span className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> Carbs
                </span>
                <span className="text-xl font-bold">{summary.carbs_estimate_g}g</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-black/5 flex flex-col">
                <span className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Fats
                </span>
                <span className="text-xl font-bold">{summary.fat_estimate_g}g</span>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/10 flex flex-col">
                <span className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Score
                </span>
                <span className="text-xl font-black text-primary">{summary.health_score}/10</span>
              </div>
            </div>
          </div>
        </motion.div>

        {(feedback.alert || feedback.suggestion) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-4 md:p-6 rounded-2xl flex flex-col gap-3 md:gap-4 border relative overflow-hidden shadow-lg ${feedback.alert
              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-500/30 text-rose-800 dark:text-rose-400'
              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
              }`}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${feedback.alert ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                {feedback.alert ? <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" /> : <Info className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <div className="flex-1">
                <p className="font-black text-base md:text-lg mb-0.5 md:mb-1">{feedback.alert ? 'Safety Warning' : 'Nutrition Insight'}</p>
                <p className="text-xs md:text-sm leading-relaxed opacity-90 lg:text-base">
                  {feedback.alert || feedback.suggestion}
                </p>
              </div>
            </div>
            {feedback.motivation && (
              <div className={`mt-1 md:mt-2 py-2 md:py-3 px-3 md:px-4 rounded-xl font-medium text-[10px] md:text-xs italic opacity-70 ${feedback.alert
                ? 'bg-rose-900/10 dark:bg-rose-400/10'
                : 'bg-emerald-900/10 dark:bg-emerald-400/10'
                }`}>
                &ldquo;{feedback.motivation}&rdquo;
              </div>
            )}
          </motion.div>
        )}

        {imageUrl || image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm border border-primary/10 shadow-sm"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md flex-shrink-0">
              <img src={imageUrl || image} alt="Food context" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Visual Context</p>
              <p className="text-sm font-medium">{summary.meal_type || 'Custom Selection'}</p>
            </div>
          </motion.div>
        ) : null}

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-xl flex items-center gap-2">
              Meal Breakdown
              <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                {detectedItems.length} items
              </div>
            </h3>
          </div>

          <div className="space-y-3">
            {detectedItems.map((item, idx) => (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                key={idx}
                className="group bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-black/5 hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-text-muted border border-black/5 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none capitalize group-hover:text-primary transition-colors">{item.food_item}</p>
                      <p className="text-xs text-text-muted mt-2 font-medium">
                        {item.quantity}{item.unit} • {item.visual_description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 whitespace-nowrap ${getCalorieColor(item.estimated_calories, item.confidence)}`}>
                      {item.estimated_calories} <span className="text-[9px] uppercase font-bold opacity-70">kcal</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end bg-black/[0.03] dark:bg-white/[0.03] px-2 py-1 rounded-md border border-black/5 dark:border-white/5 whitespace-nowrap">
                      <div className={`w-1 h-1 rounded-full ${getMatchColor(item.confidence)}`} />
                      <p className="text-[8px] font-black text-text-muted leading-none">{(item.confidence * 100).toFixed(0)}% MATCH</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={() => navigate('/dashboard')} className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            <span className="flex items-center justify-center gap-2">
              Log to Dashboard <Check className="w-6 h-6" />
            </span>
          </Button>
          <button
            onClick={() => navigate('/capture')}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors py-2"
          >
            <Camera className="w-4 h-4" /> Retake Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
