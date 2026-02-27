import React, { useState, useMemo } from "react";
import { Plus, Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import TodoItem from "@/components/TodoItem";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCategories, Category } from "@/hooks/useCategories";

interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  dueDate?: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("dyad-todo-tasks", []);
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesCategory = activeCategory === "All" || todo.category === activeCategory;
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [todos, activeCategory, searchQuery]);

  const handleToggle = (id: string) => {
    setTodos(todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="relative">
            <Input 
              placeholder="SEARCH TASKS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FFE600] border-4 border-black brutalist-shadow-sm h-14 pl-4 text-lg font-black placeholder:text-black/40 focus-visible:ring-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none transition-all"
            />
          </div>

          <div className="flex gap-0 overflow-x-auto pb-2 no-scrollbar">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all shrink-0 ${
                  activeCategory === cat 
                    ? "bg-black text-white translate-x-[1px] translate-y-[1px]" 
                    : "bg-white brutalist-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <main>
          {filteredTodos.length > 0 ? (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={() => handleToggle(todo.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 bg-white border-4 border-black brutalist-shadow text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-black uppercase">Board Clear</h3>
              <p className="font-bold text-zinc-500">Add something or go outside.</p>
            </div>
          )}
        </main>

        <div className="fixed bottom-[52px] right-8 z-50">
          <Link to="/add">
            <button className="h-16 w-16 bg-[#00FF00] border-4 border-black brutalist-shadow flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <Plus className="h-10 w-10 text-black stroke-[3]" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;