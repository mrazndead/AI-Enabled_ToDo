"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

interface TodoItemProps {
  id: string;
  title: string;
  category: 'Work' | 'Personal' | 'Shopping';
  time?: string;
  completed: boolean;
  completionTime?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<TodoItemProps['category'], string> = {
  Work: "text-blue-400",
  Personal: "text-pink-400",
  Shopping: "text-green-400",
};

const TodoItem = ({ id, title, category, time, completed, completionTime, onToggle }: TodoItemProps) => {
  const categoryColorClass = categoryColors[category] || "text-gray-400";
  
  return (
    <Card className={`mb-4 bg-gray-800 border-gray-700 text-white shadow-lg transition-opacity ${completed ? "opacity-80" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          
          {/* Custom Checkbox Area */}
          <div className="flex items-start flex-1 cursor-pointer" onClick={() => onToggle(id)}>
            <Checkbox
              id={`todo-${id}`}
              checked={completed}
              onCheckedChange={() => onToggle(id)}
              className={`mt-1 mr-4 h-6 w-6 rounded-full border-2 
                ${completed 
                  ? "border-blue-500 bg-blue-500 text-white" 
                  : "border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                }
              `}
            />
            
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${completed ? "line-through text-gray-400" : "text-white"}`}>
                {title}
              </h3>
              
              <div className="flex items-center text-sm mt-1 space-x-2">
                <span className={`${categoryColorClass} font-semibold`}>{category}</span>
                <span className="text-gray-500">•</span>
                
                {completed ? (
                  <span className="text-gray-500 flex items-center">
                    Completed {completionTime}
                  </span>
                ) : (
                  time && (
                    <span className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {time}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          
          {/* Delete functionality is omitted from the visual design but kept in the component for potential use */}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;