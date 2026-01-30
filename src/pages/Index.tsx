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
  time?: string;
  dueDate?: string;
  completed: boolean;
  completionTime?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    setTodos(
      todos.map((t) =>
        t.id === id 
          ? { 
              ...t, 
              completed: !t.completed,
              completionTime: !t.completed ? format(new Date(), 'h:mm a') : undefined
            } 
          : t
      )
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8 sm:py-12">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              placeholder="Search your tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500/50 h-12 pl-10 rounded-2xl text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("All")}
              className={`rounded-xl border-zinc-800 h-9 px-4 shrink-0 transition-all ${activeCategory === "All" ? "bg-indigo-600" : "bg-zinc-900/30 text-zinc-400"}`}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl border-zinc-800 h-9 px-4 whitespace-nowrap shrink-0 transition-all ${activeCategory === cat ? "bg-indigo-600" : "bg-zinc-900/30 text-zinc-400"}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.header>

        <main>
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              <motion.div 
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredTodos.map((todo) => (
                  <motion.div key={todo.id} variants={itemVariants} layout>
                    <TodoItem 
                      todo={todo} 
                      onToggle={() => handleToggle(todo.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-zinc-700" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Everything's clear</h3>
                <p className="text-zinc-500 max-w-[240px] mx-auto">
                  No tasks found. Time to relax or create a new one!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/add">
            <Button size="icon" className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 group">
              <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;