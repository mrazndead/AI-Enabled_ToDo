import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Trash2, Calendar, Tag, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Category, useCategories } from "@/hooks/useCategories";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  dueDate?: string;
  completed: boolean;
  completionTime?: string;
}

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todos, setTodos] = useLocalStorage<Todo[]>("dyad-todo-tasks", []);
  const [task, setTask] = useState<Todo | null>(null);

  useEffect(() => {
    const foundTask = todos.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
    } else {
      navigate("/");
    }
  }, [id, todos, navigate]);

  if (!task) return null;

  const handleToggle = () => {
    const updatedTodos = todos.map((t) =>
      t.id === id 
        ? { 
            ...t, 
            completed: !t.completed,
            completionTime: !t.completed ? format(new Date(), 'h:mm a') : undefined
          } 
        : t
    );
    setTodos(updatedTodos);
  };

  const handleDelete = () => {
    const updatedTodos = todos.filter((t) => t.id !== id);
    setTodos(updatedTodos);
    showSuccess("Task deleted successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Task Details</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 relative z-10">
        <div className="space-y-10">
          {/* Status & Title */}
          <section className="flex items-start gap-5">
            <button 
              onClick={handleToggle}
              className={cn(
                "mt-1 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 border-2 shrink-0",
                task.completed 
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20" 
                  : "border-zinc-700 hover:border-indigo-500"
              )}
            >
              {task.completed && <CheckCircle2 className="h-5 w-5 text-white" />}
            </button>
            <div className="space-y-2">
              <h2 className={cn(
                "text-3xl font-bold leading-tight transition-all duration-300",
                task.completed ? "text-zinc-500 line-through" : "text-white"
              )}>
                {task.title}
              </h2>
              {task.completed && task.completionTime && (
                <p className="text-indigo-400 text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Completed today at {task.completionTime}
                </p>
              )}
            </div>
          </section>

          {/* Metadata Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Tag className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Category</span>
              </div>
              <p className="text-lg font-semibold text-white">{task.category}</p>
            </div>

            <div className="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {task.dueDate ? format(new Date(task.dueDate), 'MMMM do, yyyy') : 'No deadline'}
              </p>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Notes</h3>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-[2rem] min-h-[200px]">
              <p className="text-zinc-400 leading-relaxed">
                {task.description || "No notes provided for this task."}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Action */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto flex justify-center pointer-events-auto">
          <Button 
            onClick={handleToggle}
            className={cn(
              "h-14 px-8 rounded-2xl font-bold shadow-xl transition-all duration-300",
              task.completed 
                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
            )}
          >
            {task.completed ? "Mark as Incomplete" : "Mark as Finished"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default TaskDetail;