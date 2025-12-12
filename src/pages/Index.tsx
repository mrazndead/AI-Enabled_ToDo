import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import TodoList from "@/components/TodoList";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Buy groceries",
      description: "Milk, bread, eggs, fruits",
      completed: false,
    },
    {
      id: "2",
      title: "Finish project",
      description: "Complete the React application",
      completed: true,
    },
  ]);

  const handleToggle = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <Link to="/add-task">
            <Button size="icon" className="rounded-full">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </Link>
        </header>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Today <span className="text-gray-500 text-sm">({todos.filter(t => !t.completed).length})</span>
            </h2>
          </div>
        </div>

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />

        <div className="fixed bottom-6 right-6">
          <Link to="/add-task">
            <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
              <PlusCircle className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;