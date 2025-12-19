import { useState, useEffect } from 'react';
import { isToday, isYesterday, differenceInDays, format } from 'date-fns';
import { useLocalStorage } from './use-local-storage';

interface StreakData {
  currentStreak: number;
  lastCompletionDate: string | null; // ISO date string (YYYY-MM-DD)
}

const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

export const useStreak = (completedTasksToday: number) => {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('dyad-streak-data', {
    currentStreak: 0,
    lastCompletionDate: null,
  });
  
  const [streak, setStreak] = useState(streakData.currentStreak);

  useEffect(() => {
    const today = getTodayDateString();
    const lastDate = streakData.lastCompletionDate;
    let newStreak = streakData.currentStreak;

    if (completedTasksToday > 0) {
      if (!lastDate || lastDate === today) {
        // Streak is maintained or started today. No change needed unless it's a new day.
        // If lastDate is null, we start at 1.
        if (!lastDate) {
          newStreak = 1;
        }
        // If lastDate is yesterday, we increment the streak.
        if (lastDate && isYesterday(new Date(lastDate))) {
          newStreak = streakData.currentStreak + 1;
        }
        
        // Update local storage only if we completed a task today and the date is different from the last recorded date
        if (lastDate !== today) {
            setStreakData({
                currentStreak: newStreak,
                lastCompletionDate: today,
            });
            setStreak(newStreak);
        }
        
      } else if (lastDate && !isYesterday(new Date(lastDate)) && !isToday(new Date(lastDate))) {
        // Missed a day, reset streak and start new one
        newStreak = 1;
        setStreakData({
          currentStreak: newStreak,
          lastCompletionDate: today,
        });
        setStreak(newStreak);
      }
    } else {
        // If no tasks completed today, check if the streak should be reset
        if (lastDate && !isToday(new Date(lastDate)) && !isYesterday(new Date(lastDate))) {
            // If the last completion was before yesterday, reset the streak to 0
            if (streakData.currentStreak > 0) {
                setStreakData({
                    currentStreak: 0,
                    lastCompletionDate: lastDate, // Keep the last date for reference, but streak is 0
                });
                setStreak(0);
            }
        }
    }
    
    // Ensure the state reflects the current stored streak value if no updates were made
    if (streak !== streakData.currentStreak) {
        setStreak(streakData.currentStreak);
    }

  }, [completedTasksToday, streakData.currentStreak, streakData.lastCompletionDate, setStreakData, streak]);

  return streak;
};