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

const AddTask = () => {
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryState>('None');
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

    const item = localStorage.getItem('dyad-todo-tasks');
    const existingTasks = item ? JSON.parse(item) : [];
    localStorage.setItem('dyad-todo-tasks', JSON.stringify([newTask, ...existingTasks]));
    
    showSuccess(`Task created!`);
    navigate("/");
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-10">
          <Link to="/">
            <Button variant="ghost" size="icon" className="glass h-10 w-10 rounded-xl">
              <X className="h-5 w-5 text-white/70" />
            </Button>
          </Link>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Create Task</h1>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20"
          >
            Save
          </Button>
        </header>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Task Details</p>
            <div className="glass p-6 rounded-[2rem] space-y-6">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="h-auto p-0 bg-transparent border-none text-2xl font-bold placeholder:text-white/10 focus-visible:ring-0"
              />
              <div className="h-[1px] w-full bg-white/5" />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                className="bg-transparent border-none p-0 min-h-[100px] text-white/50 placeholder:text-white/10 focus-visible:ring-0 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="glass h-20 w-full rounded-[1.5rem] flex flex-col items-center justify-center space-y-1">
                    <CalendarIcon className="h-5 w-5 text-indigo-400" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">
                      {dueDate ? format(dueDate, "MMM dd") : "Set Date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="glass-dark border-white/10">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Tags</p>
              <Button variant="ghost" className="glass h-20 w-full rounded-[1.5rem] flex flex-col items-center justify-center space-y-1">
                <Tag className="h-5 w-5 text-purple-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase">
                  {category === 'None' ? 'Choose' : category}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Quick Select Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-indigo-500 text-white' : 'glass text-white/30 hover:text-white/60'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;