import React, { useState, useMemo } from "react";
import { Plus, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import TodoItem from "@/components/TodoItem";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCategories, Category } from "@/hooks/useCategories";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-[#FFE600] border-4 border-black p-6 brutalist-shadow"
        >
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Tasks_</h1>
          <p className="font-bold text-sm mt-1">Don't forget. Just do it.</p>
        </motion.div>

        <header className="space-y-4">
          <div className="relative">
            <Input 
              placeholder="SEARCH TASKS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-4 border-black brutalist-shadow-sm h-14 pl-4 text-lg font-black placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-none transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2 border-2 border-black font-black uppercase text-xs transition-all ${
                  activeCategory === cat 
                    ? "bg-black text-white translate-x-[2px] translate-y-[2px]" 
                    : "bg-white brutalist-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <main>
          <AnimatePresence mode="popLayout">
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
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-20 bg-white border-4 border-black brutalist-shadow text-center"
              >
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase">Board Clear</h3>
                <p className="font-bold text-zinc-500">Add something or go outside.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <div className="fixed bottom-8 right-8 z-50">
          <Link to="/add">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-16 w-16 bg-[#00FF00] border-4 border-black brutalist-shadow flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Plus className="h-10 w-10 text-black stroke-[3]" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;