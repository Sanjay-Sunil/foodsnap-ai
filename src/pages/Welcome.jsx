import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, ChevronRight, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';

const Welcome = () => {
  const navigate = useNavigate();

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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-b from-background to-surface">
      {/* Theme Toggle in top-right */}
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
        className="relative z-10 w-full max-w-md text-center space-y-8"
      >
        {/* Logo / Brand */}
        <motion.div variants={itemVariants} className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-2xl shadow-xl shadow-primary/10 backdrop-blur-sm border border-primary/20">
            <Camera className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-text">
            FoodSnap <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">AI</span>
          </h1>
          <p className="text-text-muted text-lg">
            Turn photos into precision health data.
          </p>
        </motion.div>

        {/* Simulated Feature Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 py-6">
          <div className="p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2 transition-colors">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium text-text-muted">Instant Analysis</span>
          </div>
          <div className="p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2 transition-colors">
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-text-muted">Smart Tracking</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4">
          <Button
            onClick={() => navigate('/login')}
            className="w-full text-lg h-14"
          >
            Get Started <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-sm text-text-muted">
            Already have an account? <span onClick={() => navigate('/login')} className="text-primary font-medium cursor-pointer hover:underline">Log in</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Welcome;
