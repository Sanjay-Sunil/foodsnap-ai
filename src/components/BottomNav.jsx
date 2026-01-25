import { Home, Camera, BarChart2, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Camera, label: 'Snap', path: '/capture', isMain: true },
    { icon: BarChart2, label: 'Trends', path: '/trends' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-2 safe-bottom z-50">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                isActive ? "text-primary scale-110" : "text-text-muted hover:text-text",
                item.isMain && "bg-primary text-white -mt-8 shadow-lg shadow-primary/40 rounded-full w-14 h-14"
              )}
            >
              <item.icon className={cn("w-6 h-6", item.isMain && "w-7 h-7")} />
              {!item.isMain && <span className="text-[10px] font-medium mt-1">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
