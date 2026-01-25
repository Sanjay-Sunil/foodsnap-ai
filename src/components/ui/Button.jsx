import { motion } from 'framer-motion';
import { cn } from '../../utils/cn'; // Need to create this utility
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', className, isLoading, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-surface text-text border border-gray-200 hover:bg-gray-50 hover:text-primary",
    ghost: "bg-transparent text-text-muted hover:text-primary hover:bg-primary/10",
    gamer: "bg-black border border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_15px_rgba(var(--color-primary),0.5)] uppercase tracking-wider font-mono",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
