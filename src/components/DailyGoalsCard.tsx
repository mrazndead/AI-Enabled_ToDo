import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

interface DailyGoalsCardProps {
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

const DailyGoalsCard: React.FC<DailyGoalsCardProps> = ({ totalTasks, completedTasks, streak }) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="bg-gray-800 border-none text-white shadow-lg p-4">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-200">Daily Goals</h2>
          <span className="bg-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {percentage}% Done
          </span>
        </div>
        
        <Progress value={percentage} className="h-2 bg-gray-700 [&>div]:bg-blue-500" />

        <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
          <span>{completedTasks}/{totalTasks} Tasks Completed</span>
          <span className="flex items-center">
            <Flame className="h-4 w-4 mr-1 text-orange-400" />
            {streak} Day Streak
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsCard;