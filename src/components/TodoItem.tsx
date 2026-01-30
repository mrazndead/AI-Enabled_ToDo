import React from "react";
import { Link } from "react-router-dom";
import { Check, Circle, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { Category } from "@/hooks/useCategories";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description?: string;
    category: Category;
    dueDate?: string;
    completed: boolean;
  };
  onToggle: () => void;
}

const categoryAccentColors: Record<string, string> = {
  Work: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  Personal: "border-pink-500/30 bg-pink-500/5 text-pink-400",
  Shopping: "border-green-500/30 bg-green-500/5 text-green-400",
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && !todo.completed;
  const accent = categoryAccentColors[todo.category] || "border-purple-500/30 bg-purple-500/5 text-purple-400";

  return (
    <div className="group relative">
      <div className={cn(
        "flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl transition-all duration-200",
        "hover:bg-zinc-900/60 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-black/20",
        todo.completed && "opacity-60"
      )}>
        {/* Checkbox */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className={cn(
            "h-6 w-6 rounded-lg flex items-center justify-center transition-all duration-200 border-2",
            todo.completed 
              ? "bg-indigo-600 border-indigo-600" 
              : "border-zinc-700 hover:border-indigo-500"
          )}
        >
          {todo.completed && <Check className="h-4 w-4 text-white" />}
        </button>

        {/* Content */}
        <Link to={`/task/${todo.id}`} className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <h3 className={cn(
              "text-base font-medium transition-all duration-200 truncate",
              todo.completed ? "line-through text-zinc-500" : "text-zinc-100"
            )}>
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border", accent)}>
                {todo.category}
              </span>
              
              {todo.dueDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs font-medium",
                  isOverdue ? "text-red-400" : "text-zinc-500"
                )}>
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), 'MMM d')}
                </div>
              )}
            </div>
          </div>
        </Link>

        <Link to={`/task/${todo.id}`} className="text-zinc-700 group-hover:text-zinc-400 transition-colors">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default TodoItem;