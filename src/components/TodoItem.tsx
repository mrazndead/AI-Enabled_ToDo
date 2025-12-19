"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Trash } from "lucide-react";
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
import { Link } from "react-router-dom"; // Import Link

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

const TodoItem = ({ id, title, category, time, completed, completionTime, onToggle, onDelete }: TodoItemProps) => {
  const categoryColorClass = categoryColors[category] || "text-gray-400";
  
  // Function to handle checkbox click
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ensure this click doesn't affect the parent container if it had a handler
    onToggle(id);
  };

  return (
    <Card className={`mb-4 bg-gray-800 border-gray-700 text-white shadow-lg transition-opacity ${completed ? "opacity-80" : ""}`}>
      <CardContent className="p-4 flex items-center justify-between">
        
        {/* Checkbox (Separate from Link) */}
        <Checkbox
          id={`todo-${id}`}
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          onClick={handleCheckboxClick}
          className={`mt-1 mr-4 h-6 w-6 rounded-full border-2 flex-shrink-0
            ${completed 
              ? "border-blue-500 bg-blue-500 text-white" 
              : "border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            }
          `}
        />
        
        {/* Task Details (Wrapped in Link for navigation) */}
        <Link to={`/task/${id}`} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium truncate ${completed ? "line-through text-gray-400" : "text-white"}`}>
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
        </Link>
        
        {/* Delete Button (Confirmation Dialog) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-4 flex-shrink-0 text-gray-500 hover:text-red-500 hover:bg-gray-700/50"
              onClick={(e) => e.stopPropagation()} // Prevent any unintended behavior
            >
              <Trash className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your task: "{title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default TodoItem;