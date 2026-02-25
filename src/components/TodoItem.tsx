import React from "react";
import { Link } from "react-router-dom";
import { Check, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Category } from "@/hooks/useCategories";
import { motion } from "framer-motion";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    category: Category;
    dueDate?: string;
    completed: boolean;
  };
  onToggle: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <motion.div 
      layout
      className="group relative"
    >
      <div className={cn(
        "flex items-center gap-4 p-5 bg-white border-4 border-black brutalist-shadow transition-all",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        todo.completed && "bg-zinc-100 opacity-80"
      )}>
        {/* Brutalist Checkbox */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className={cn(
            "h-8 w-8 border-4 border-black flex items-center justify-center transition-all",
            todo.completed ? "bg-[#00FF00]" : "bg-white hover:bg-zinc-100"
          )}
        >
          {todo.completed && <Check className="h-6 w-6 text-black stroke-[4]" />}
        </button>

        <Link to={`/task/${todo.id}`} className="flex-1 min-w-0">
          <div className="space-y-1">
            <h3 className={cn(
              "text-xl font-black uppercase tracking-tight truncate",
              todo.completed && "line-through decoration-[4px]"
            )}>
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">
                {todo.category}
              </span>
              {todo.dueDate && (
                <div className="flex items-center gap-1 text-[10px] font-black text-zinc-500 uppercase">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(todo.dueDate), 'MMM d')}
                </div>
              )}
            </div>
          </div>
        </Link>

        <ArrowRight className="h-6 w-6 stroke-[3]" />
      </div>
    </motion.div>
  );
};

export default TodoItem;