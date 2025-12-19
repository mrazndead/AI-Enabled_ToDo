import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import TodoList from "@/components/TodoList";
import DailyGoalsCard from "@/components/DailyGoalsCard";
import { format, isToday } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getGreeting } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak"; // Import useStreak

interface Todo {
  id: string;
  title: string;
  category: 'Work' | 'Personal' | 'Shopping'; // Updated categories
  time?: string;
  completed: boolean;
  completionTime?: string;
}

type CategoryFilter = 'All' | 'Work' | 'Personal' | 'Shopping'; // Updated categories

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Review Q3 Design Mockups",
    category: "Work",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "2",
    title: "Grocery Shopping",
    category: "Shopping", // Changed category
    time: "5:00 PM",
    completed: false,
  },
  {
    id: "3",
    title: "Morning Standup",
    category: "Work",
    completed: true,
    completionTime: "9:30 AM",
  },
  {
    id: "4",
    title: "Buy new shoes",
    category: "Shopping",
    completed: false,
  },
  {
    id: "5",
    title: "Read book chapter",
    category: "Personal",
    completed: false,
  },
];

const Index = () => {
  // Use useLocalStorage to persist todos
  const [todos, setTodos] = useLocalStorage<Todo[]>('dyad-todo-tasks', initialTodos);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');

  const handleToggle = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { 
              ...todo, 
              completed: !todo.completed,
              completionTime: !todo.completed ? format(new Date(), 'h:mm a') : undefined
            } 
          : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  // Calculate tasks completed today
  const completedTasksToday = todos.filter(t => t.completed && t.completionTime && isToday(new Date(t.completionTime))).length;
  
  const currentStreak = useStreak(completedTasksToday); // Use the new streak hook

  const completedTasks = todos.filter(t => t.completed).length;
  const totalTasks = todos.length;
  const todayDate = format(new Date(), 'EEEE, MMM dd');
  const greeting = getGreeting(); // Get dynamic greeting
  
  const filteredTodos = todos.filter(todo => 
    activeFilter === 'All' || todo.category === activeFilter
  );
  
  const FilterButton: React.FC<{ category: CategoryFilter }> = ({ category }) => {
    const isActive = activeFilter === category;
    return (
      <Button
        variant={isActive ? "default" : "secondary"}
        onClick={() => setActiveFilter(category)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors h-auto
          ${isActive 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
          }
        `}
      >
        {category}
      </Button>
    );
  };


  return (
    // Apply dark background to match the design
    <div className="min-h-screen bg-[#101827] text-white"> 
      <div className="max-w-md mx-auto px-4 py-12">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-1">{greeting}</h1>
            <p className="text-gray-400 text-md">{todayDate}</p>
          </div>
          
          {/* Placeholder for spacing */}
          <div className="h-8 w-20" /> 
        </header>

        {/* Daily Goals Card */}
        <div className="mb-8">
          <DailyGoalsCard 
            totalTasks={totalTasks} 
            completedTasks={completedTasks} 
            streak={currentStreak} // Pass the calculated streak
          />
        </div>

        {/* Category Filters */}
        <div className="flex space-x-3 overflow-x-auto pb-4 whitespace-nowrap scrollbar-hide">
          <FilterButton category="All" />
          <FilterButton category="Work" />
          <FilterButton category="Personal" />
          <FilterButton category="Shopping" />
        </div>
        
        {/* Today's Tasks Header */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mt-4 mb-2">
          Today's Tasks
        </h2>

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-6 right-6 z-10">
          <Link to="/add-task">
            <Button 
              size="icon" 
              className="rounded-full w-14 h-14 shadow-xl bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;