import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { X, Calendar as CalendarIcon, Tag, Plus, Check } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useCategories, Category } from "@/hooks/useCategories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type CategoryState = Category | 'None';

// Helper function to read/write tasks directly to localStorage
const getTasksFromStorage = () => {
  if (typeof window === 'undefined') return [];
  const item = localStorage.getItem('dyad-todo-tasks');
  return item ? JSON.parse(item) : [];
};

const saveTasksToStorage = (tasks: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dyad-todo-tasks', JSON.stringify(tasks));
  }
};

const AddTask = () => {
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryState>('Personal');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category: category === 'None' ? 'Personal' : category,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      completed: false,
    };

    const existingTasks = getTasksFromStorage();
    saveTasksToStorage([newTask, ...existingTasks]);
    showSuccess(`Added: ${title}`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900">
              <X className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">New Task</h1>
          <Button 
            onClick={handleSubmit} 
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-semibold"
            disabled={!title.trim()}
          >
            Create
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Main Input */}
          <section className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Task Title</label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-transparent border-none text-3xl font-bold h-auto p-0 focus-visible:ring-0 placeholder:text-zinc-800"
            />
          </section>

          {/* Details Section */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden divide-y divide-zinc-800/50 shadow-xl shadow-black/20">
            {/* Description */}
            <div className="p-6 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <Plus className="h-3 w-3" /> Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details..."
                className="bg-transparent border-none p-0 focus-visible:ring-0 text-zinc-300 resize-none min-h-[100px]"
              />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between p-6 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-2xl">
                      <CalendarIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">Due Date</p>
                      <p className="text-xs text-zinc-500">
                        {dueDate ? format(dueDate, 'EEEE, MMM do') : 'Set a deadline'}
                      </p>
                    </div>
                  </div>
                  {dueDate && <Check className="h-5 w-5 text-indigo-500" />}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="[&_td]:text-zinc-100 [&_th]:text-zinc-500 [&_button]:text-zinc-100 [&_button:hover]:bg-zinc-800"
                />
              </PopoverContent>
            </Popover>
          </section>

          {/* Tags */}
          <section className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200",
                    category === cat 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AddTask;