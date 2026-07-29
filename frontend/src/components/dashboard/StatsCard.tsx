import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  bgClass?: string;
  trend?: number;
}

export const StatsCard = ({ title, value, subtext, icon, bgClass = '', trend }: StatsCardProps) => {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(245,197,24,0.05)] group ${bgClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2.5 bg-dark-bg rounded-xl group-hover:bg-gold/10 transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
          {trend !== undefined && (
            <span className={`text-xs font-medium flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
