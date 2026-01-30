import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import TodoList from "@/components/TodoList";
import DailyGoalsCard from "@/components/DailyGoalsCard";
import { format, isToday } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getGreeting } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";
import { useCategories, Category } from "@/hooks/useCategories";
import CategoryManagerDialog from "@/components/CategoryManagerDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Todo {
  id: string;
  title: string;
  category: Category;
  time?: string;
  completed: boolean;
  completionTime?: string;
}

type CategoryFilter = 'All' | Category;

const initialTodos: Todo[] = [
  { id: "1", title: "Review Q3 Design Mockups", category: "Work", time: "10:00 AM", completed: false },
  { id: "2", title: "Grocery Shopping", category: "Shopping", time: "5:00 PM", completed: false },
  { id: "3", title: "Morning Standup", category: "Work", completed: true, completionTime: "9:30 AM" },
];

const Index = () => {
  const { categories } = useCategories();
  const [todos, setTodos] = useLocalStorage<Todo[]>('dyad-todo-tasks', initialTodos);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');

  const handleToggle = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completionTime: !todo.completed ? format(new Date(), 'h:mm a') : undefined
      } : todo
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const completedTasksToday = todos.filter(t => t.completed && t.completionTime && isToday(new Date(t.completionTime))).length;
  const currentStreak = useStreak(completedTasksToday);
  const completedTasks = todos.filter(t => t.completed).length;
  const totalTasks = todos.length;
  const greeting = getGreeting();
  
  const filteredTodos = todos.filter(todo => activeFilter === 'All' || todo.category === activeFilter);
  
  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-6 py-10 pb-32">
        
        {/* User Profile & Settings */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[2px] opacity-75" />
              <Avatar className="h-12 w-12 border-2 border-background relative">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-white font-black text-xl tracking-tight leading-none">{greeting}, Alex</p>
              <p className="text-indigo-300/50 text-xs font-bold uppercase tracking-widest mt-1">
                {format(new Date(), 'EEEE, MMM dd')}
              </p>
            </div>
          </div>
          
          <CategoryManagerDialog>
            <Button variant="ghost" size="icon" className="glass h-10 w-10 rounded-xl">
              <Settings className="h-5 w-5 text-white/70" />
            </Button>
          </CategoryManagerDialog>
        </div>

        {/* Goals Section */}
        <div className="mb-10">
          <DailyGoalsCard 
            totalTasks={totalTasks} 
            completedTasks={completedTasks} 
            streak={currentStreak} 
          />
        </div>

        {/* Categories Bar */}
        <div className="sticky top-4 z-30 mb-8 py-2">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant="ghost"
              onClick={() => setActiveFilter('All')}
              className={`rounded-2xl px-5 h-10 font-bold text-xs uppercase tracking-widest transition-all ${activeFilter === 'All' ? 'glass text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => setActiveFilter(category)}
                className={`rounded-2xl px-5 h-10 font-bold text-xs uppercase tracking-widest transition-all ${activeFilter === category ? 'glass text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Task List Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              Today's Schedule
            </h2>
            <div className="h-[1px] flex-1 bg-white/5 ml-4" />
          </div>

          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <Link to="/add-task">
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-500/50 transition-all" />
              <Button 
                className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.5)] border border-white/20 relative"
              >
                <Plus className="h-8 w-8 text-white stroke-[3px]" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;