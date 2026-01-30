import React from 'react';
import { cn } from '@/lib/utils';

interface TaskDetailItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  iconBgColor?: string;
  onClick?: () => void;
}

const TaskDetailItem: React.FC<TaskDetailItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  iconBgColor = "bg-zinc-800",
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-5 transition-all duration-200",
        onClick && "cursor-pointer hover:bg-zinc-800/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-2xl border border-white/5", iconBgColor)}>
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-white tracking-tight">{title}</p>
          <p className="text-xs font-medium text-zinc-500 tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-bold text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-700/50">
          {value}
        </span>
      </div>
    </div>
  );
};

export default TaskDetailItem;