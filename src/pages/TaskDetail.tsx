import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Trash2, Calendar, Tag, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Category } from "@/hooks/useCategories";
import { format } from "date-fns";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  const task = useMemo(() => {
    return todos.find((t) => t.id === id);
  }, [id, todos]);

  React.useEffect(() => {
    if (todos.length > 0 && !task) {
      navigate("/");
    }
  }, [task, todos, navigate]);

  if (!task) return null;

  const handleToggle = () => {
    const newStatus = !task.completed;
    const updatedTodos = todos.map((t) =>
      t.id === id 
        ? { 
            ...t, 
            completed: newStatus,
            completionTime: newStatus ? format(new Date(), 'h:mm a') : undefined
          } 
        : t
    );
    setTodos(updatedTodos);
    showSuccess(newStatus ? "Task marked as finished" : "Task marked as incomplete");
  };

  const handleDelete = () => {
    const updatedTodos = todos.filter((t) => t.id !== id);
    setTodos(updatedTodos);
    showSuccess("Task deleted");
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Task Details</h1>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              className="rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 relative z-10 pb-32">
        <div className="space-y-10">
          <section className="flex items-start gap-5">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleToggle}
              className={cn(
                "mt-1 h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shrink-0",
                task.completed 
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20" 
                  : "border-zinc-700 hover:border-indigo-500 bg-zinc-900/50"
              )}
            >
              <AnimatePresence mode="wait">
                {task.completed && (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="space-y-2">
              <h2 className={cn(
                "text-3xl font-bold leading-tight transition-all duration-300",
                task.completed ? "text-zinc-500 line-through" : "text-white"
              )}>
                {task.title}
              </h2>
              {task.completed && task.completionTime && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-indigo-400 text-sm font-medium flex items-center gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Finished today at {task.completionTime}
                </motion.p>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-500">
                <Tag className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Category</span>
              </div>
              <p className="text-lg font-semibold text-white">{task.category}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {task.dueDate ? format(new Date(task.dueDate), 'MMMM do, yyyy') : 'No deadline'}
              </p>
            </motion.div>
          </section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Notes</h3>
            <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-[2.5rem] min-h-[160px]">
              <p className={cn(
                "leading-relaxed transition-colors duration-300",
                task.completed ? "text-zinc-600" : "text-zinc-300"
              )}>
                {task.description || "No notes provided for this task."}
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto flex justify-center pointer-events-auto">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleToggle}
              className={cn(
                "h-16 px-10 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300",
                task.completed 
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20"
              )}
            >
              {task.completed ? "Mark as Incomplete" : "Mark as Finished"}
            </Button>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
};

export default TaskDetail;