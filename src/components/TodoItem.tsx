"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Trash, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Category } from '@/hooks/useCategories';

interface TodoItemProps {
  id: string;
  title: string;
  category: Category;
  time?: string;
  completed: boolean;
  completionTime?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryStyles: Record<string, { bg: string, text: string, dot: string }> = {
  Work: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
  Personal: { bg: "bg-pink-500/10", text: "text-pink-400", dot: "bg-pink-400" },
  Shopping: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
};

const getCategoryStyles = (category: Category) => {
  return categoryStyles[category] || { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" };
};

const TodoItem = ({ id, title, category, time, completed, completionTime, onToggle, onDelete }: TodoItemProps) => {
  const styles = getCategoryStyles(category);
  
  return (
    <div className="group relative">
      {/* Active state highlight border */}
      <div className={`absolute -inset-[1px] rounded-[1.25rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity blur-[2px] ${completed ? 'hidden' : ''}`} />
      
      <Card className={`relative glass border-white/5 overflow-hidden transition-all duration-300 ${completed ? "opacity-50" : "hover:bg-white/[0.07]"}`}>
        <CardContent className="p-4 flex items-center space-x-4">
          
          <Checkbox
            id={`todo-${id}`}
            checked={completed}
            onCheckedChange={() => onToggle(id)}
            className={`h-6 w-6 rounded-full border-2 transition-all duration-300 flex-shrink-0
              ${completed 
                ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-none text-white" 
                : "border-white/20 hover:border-indigo-400"
              }
            `}
          />
          
          <Link to={`/task/${id}`} className="flex-1 min-w-0">
            <div className="space-y-1">
              <h3 className={`text-[1.05rem] font-semibold leading-tight truncate transition-all ${completed ? "line-through text-white/40" : "text-white"}`}>
                {title}
              </h3>
              
              <div className="flex items-center space-x-2">
                <div className={`flex items-center px-2 py-0.5 rounded-md ${styles.bg} ${styles.text} text-[10px] font-black uppercase tracking-widest`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${styles.dot} mr-1.5`} />
                  {category}
                </div>
                
                {completed ? (
                  <span className="text-white/30 text-[11px] font-medium">
                    Done • {completionTime}
                  </span>
                ) : (
                  time && (
                    <span className="text-white/30 text-[11px] font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1 opacity-50" /> {time}
                    </span>
                  )
                )}
              </div>
            </div>
          </Link>

          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-dark border-white/10 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Task?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/50">
                    Are you sure you want to delete "{title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-white/10">Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ChevronRight className="h-5 w-5 text-white/10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoItem;