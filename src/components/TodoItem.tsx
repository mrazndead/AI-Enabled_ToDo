"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ id, title, description, completed, onToggle, onDelete }: TodoItemProps) => {
  return (
    <Card className={`mb-4 ${completed ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle(id)}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <h3 className={`font-semibold ${completed ? "line-through" : ""}`}>
              {title}
            </h3>
            <p className={`text-sm text-gray-600 mt-1 ${completed ? "line-through" : ""}`}>
              {description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;