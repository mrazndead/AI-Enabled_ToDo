"use client";

import React from "react";
import TodoItem from "@/components/TodoItem";
import { Category } from "@/hooks/useCategories";

interface Todo {
  id: string;
  title: string;
  category: Category;
  time?: string;
  completed: boolean;
  completionTime?: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-white/20">
        <p className="font-medium">No tasks yet. Add your first task!</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          category={todo.category}
          time={todo.time}
          completed={todo.completed}
          completionTime={todo.completionTime}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;