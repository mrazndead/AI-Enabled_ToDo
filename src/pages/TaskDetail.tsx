import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Trash2, Calendar, Tag, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCategories, Category } from "@/hooks/useCategories";
import { format } from "date-fns";
import { showSuccess } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  dueDate?: string;
  completed: boolean;
}

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [todos, setTodos] = useLocalStorage<Todo[]>("dyad-todo-tasks", []);
  const [isChangingCategory, setIsChangingCategory] = useState(false);

  const task = useMemo(() => todos.find((t) => t.id === id), [id, todos]);

  if (!task) return null;

  const handleToggle = () => {
    setTodos(todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
    showSuccess("STATUS UPDATED!");
  };

  const handleDelete = () => {
    setTodos(todos.filter((t) => t.id !== id));
    showSuccess("TASK AXED!");
    navigate("/");
  };

  const handleCategoryChange = (newCategory: Category) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, category: newCategory } : t));
    setIsChangingCategory(false);
    showSuccess(`MOVED TO ${newCategory.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8 pb-32">
        <header className="flex items-center justify-between bg-white border-4 border-black p-6 brutalist-shadow">
          <Link to="/">
            <div className="flex items-center gap-2 font-black uppercase hover:translate-x-[-2px] transition-transform">
              <ChevronLeft className="h-6 w-6 stroke-[3]" />
              Back
            </div>
          </Link>
          <button 
            onClick={handleDelete}
            className="p-3 bg-[#FF0000] border-2 border-black brutalist-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Trash2 className="h-6 w-6 text-white" />
          </button>
        </header>

        <main className="space-y-10">
          <section className="bg-[#FFE600] border-4 border-black p-8 brutalist-shadow">
            <h2 className={cn(
              "text-4xl font-black uppercase italic leading-none mb-6",
              task.completed && "line-through decoration-[8px]"
            )}>
              {task.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsChangingCategory(!isChangingCategory)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 font-black uppercase text-xs border-2 border-black transition-all",
                    isChangingCategory ? "bg-white text-black" : "bg-black text-white hover:bg-zinc-800"
                  )}
                >
                  {task.category}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", isChangingCategory && "rotate-180")} />
                </button>

                {isChangingCategory && (
                  <div className="absolute top-full left-0 mt-2 z-10 bg-white border-4 border-black brutalist-shadow-sm flex flex-col min-w-[120px]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={cn(
                          "px-4 py-2 text-left font-black uppercase text-xs border-b-2 border-black last:border-b-0 hover:bg-[#00FFFF] transition-colors",
                          task.category === cat && "bg-zinc-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="font-black uppercase text-xs flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {task.dueDate ? format(new Date(task.dueDate), 'MMMM do, yyyy') : 'NO DATE'}
              </span>
            </div>
          </section>

          <section className="bg-white border-4 border-black brutalist-shadow p-8 min-h-[200px]">
            <h3 className="text-xs font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block">Notes_</h3>
            <p className="text-xl font-bold leading-relaxed">
              {task.description || "NO NOTES PROVIDED."}
            </p>
          </section>
        </main>

        <footer className="fixed bottom-[10px] left-0 right-0 p-8 flex justify-center pointer-events-none">
          <button 
            onClick={handleToggle}
            className={cn(
              "pointer-events-auto h-20 px-12 border-4 border-black brutalist-shadow text-2xl font-black uppercase transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
              task.completed ? "bg-zinc-200 text-zinc-500" : "bg-[#00FF00] text-black"
            )}
          >
            {task.completed ? "UNFINISH_" : "FINISH_TASK_"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TaskDetail;