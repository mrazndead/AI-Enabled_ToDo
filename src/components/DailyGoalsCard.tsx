import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, Trophy } from "lucide-react";

interface DailyGoalsCardProps {
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

const DailyGoalsCard: React.FC<DailyGoalsCardProps> = ({ totalTasks, completedTasks, streak }) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="glass border-none overflow-hidden relative">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[100px] pointer-events-none" />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Your Progress</h2>
            <p className="text-indigo-300/70 text-sm font-medium">Keep smashing those goals!</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              <Flame className="h-4 w-4 text-orange-400 fill-orange-400" />
              <span className="text-orange-400 text-xs font-bold">{streak} DAY STREAK</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-4xl font-black text-white">{percentage}%</span>
            <span className="text-indigo-200/50 text-sm font-semibold">{completedTasks} of {totalTasks} completed</span>
          </div>
          
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Target className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-300/50 font-bold uppercase tracking-wider">Level</p>
              <p className="text-sm font-bold text-white">Achiever</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center space-x-3">
            <div className="p-2 bg-pink-500/20 rounded-xl">
              <Trophy className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <p className="text-[10px] text-pink-300/50 font-bold uppercase tracking-wider">Next Reward</p>
              <p className="text-sm font-bold text-white">500 XP</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsCard;