import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  iconBgColor: string;
  onClick?: () => void;
}

const TaskDetailItem: React.FC<TaskDetailItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  iconBgColor,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
        "hover:bg-gray-800/70 border-b border-gray-700/50 last:border-b-0"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-xl", iconBgColor)}>
          {icon}
        </div>
        <div>
          <p className="text-lg font-medium text-white">{title}</p>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-gray-400">
        <span className="font-medium">{value}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
};

export default TaskDetailItem;