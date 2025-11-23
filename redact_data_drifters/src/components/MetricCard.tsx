import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  data: number[];
  onClick: () => void;
}

const iconMap: Record<string, any> = {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
};

export function MetricCard({ title, value, change, icon, data, onClick }: MetricCardProps) {
  const { is3DMode } = useDashboard();
  const Icon = iconMap[icon] || DollarSign;
  const isPositive = change >= 0;
  const chartData = data.map((val, idx) => ({ value: val }));

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer h-full"
      style={is3DMode ? {
        transform: 'perspective(1000px) rotateY(2deg)',
        transformStyle: 'preserve-3d',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(59, 130, 246, 0.1)',
      } : {}}
    >
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-blue-900/40 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent" />
        {is3DMode && (
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
            style={{
              transform: 'translateZ(10px)',
            }}
          />
        )}
        <div className="relative p-4 sm:p-6" style={is3DMode ? { transform: 'translateZ(20px)' } : {}}>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="space-y-1 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-blue-200/70">{title}</p>
            <p className="text-2xl sm:text-3xl text-white font-semibold">{value}</p>
          </div>

          <div className="h-10 sm:h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
