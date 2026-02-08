import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const Trends = () => {
  const { persona } = useAuth();

  const data = [
    { name: 'Mon', cal: 2100, pro: 140 },
    { name: 'Tue', cal: 2300, pro: 130 },
    { name: 'Wed', cal: 1950, pro: 150 },
    { name: 'Thu', cal: 2200, pro: 135 },
    { name: 'Fri', cal: 2500, pro: 120 },
    { name: 'Sat', cal: 2700, pro: 110 },
    { name: 'Sun', cal: 2100, pro: 145 },
  ];

  const activeColor = '#10b981'; // Standard Emerald Green

  return (
    <div className="min-h-screen p-6 space-y-8 pb-24">
      <TopBar title="Weekly Trends" />

      <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-80">
        <h3 className="text-lg font-semibold mb-6">Calorie Intake</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--color-text))' }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="cal"
              fill={activeColor}
              radius={[6, 6, 6, 6]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Highlights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-2xl">
            <p className="text-text-muted text-sm">Average</p>
            <p className="text-2xl font-bold text-primary">2,264</p>
            <p className="text-xs text-text-muted">kcal / day</p>
          </div>
          <div className="p-4 bg-accent/5 rounded-2xl">
            <p className="text-text-muted text-sm">Highest</p>
            <p className="text-2xl font-bold text-accent">Sat</p>
            <p className="text-xs text-text-muted">Cheat day?</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Trends;
