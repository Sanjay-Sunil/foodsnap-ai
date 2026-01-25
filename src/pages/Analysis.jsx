import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Analysis = () => {
  const navigate = useNavigate();
  const { persona } = useAuth();

  // Mock Recognition Data
  const detectedItems = [
    { name: "Grilled Salmon", weight: "200g", cal: 412, protein: 40, fat: 26, carbs: 0 },
    { name: "Asparagus", weight: "150g", cal: 30, protein: 3, fat: 0, carbs: 6 },
    { name: "Quinoa", weight: "100g", cal: 120, protein: 4, fat: 2, carbs: 21 },
  ];

  const totalMacros = detectedItems.reduce((acc, item) => ({
    cal: acc.cal + item.cal,
    protein: acc.protein + item.protein,
    fat: acc.fat + item.fat,
    carbs: acc.carbs + item.carbs
  }), { cal: 0, protein: 0, fat: 0, carbs: 0 });

  const warnings = persona === 'navigator' ? ["Contains moderate sodium"] : [];

  return (
    <div className="min-h-screen bg-surface p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Analysis Complete</h1>

      <div className="space-y-6">
        {/* Image Thumbnail */}
        <div className="h-48 rounded-3xl bg-gray-200 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">
            Captured Image
          </div>
          {/* Bounding Box Overlays (Mock) */}
          <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] border-2 border-primary rounded-lg flex items-start justify-center">
            <span className="bg-primary text-white text-[10px] px-1 rounded-b">Salmon</span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Detected Items</h3>
          {detectedItems.map((item, idx) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-background rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-text-muted">{item.weight}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{item.cal} kcal</p>
                <p className="text-xs text-text-muted">P:{item.protein} C:{item.carbs} F:{item.fat}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alert for Navigator */}
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-3"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{warnings[0]} - Please check with your dietary plan.</p>
          </motion.div>
        )}

        {/* Total Summary */}
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
          <div className="flex justify-between items-end mb-4">
            <span className="text-text-muted font-medium">Total Meal</span>
            <span className="text-3xl font-bold text-primary">{totalMacros.cal} kcal</span>
          </div>
          <div className="flex justify-between text-center gap-2">
            <div className="flex-1 bg-white/50 rounded-lg p-2">
              <div className="text-xs text-text-muted">Protein</div>
              <div className="font-bold">{totalMacros.protein}g</div>
            </div>
            <div className="flex-1 bg-white/50 rounded-lg p-2">
              <div className="text-xs text-text-muted">Carbs</div>
              <div className="font-bold">{totalMacros.carbs}g</div>
            </div>
            <div className="flex-1 bg-white/50 rounded-lg p-2">
              <div className="text-xs text-text-muted">Fat</div>
              <div className="font-bold">{totalMacros.fat}g</div>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate('/dashboard')} className="w-full h-14 text-lg">
          Log Meal <Check className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Analysis;
