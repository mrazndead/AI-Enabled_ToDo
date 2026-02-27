import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { useCategories, Category } from "@/hooks/useCategories";

const AddTask = () => {
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>('Work');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      completed: false,
      dueDate: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('dyad-todo-tasks') || '[]');
    localStorage.setItem('dyad-todo-tasks', JSON.stringify([newTask, ...existing]));
    showSuccess("TASK CREATED!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-black text-white p-6 brutalist-shadow">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">NEW_TASK</h1>
          <Link to="/">
            <X className="h-8 w-8 cursor-pointer hover:rotate-90 transition-transform" />
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black uppercase">What is it?</label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G. PAY RENT"
              className="bg-white border-4 border-black brutalist-shadow h-20 px-6 text-2xl font-black uppercase placeholder:text-zinc-300 focus-visible:ring-0"
            />
          </div>

          <div className="bg-white border-4 border-black brutalist-shadow p-6 space-y-4">
            <label className="text-sm font-black uppercase">Details_</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ADD NOTES..."
              className="border-2 border-black h-32 text-lg font-bold resize-none focus-visible:ring-0"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase">Pick Category_</label>
            <div className="flex flex-wrap gap-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-3 border-4 border-black font-black uppercase text-sm transition-all ${
                    category === cat 
                      ? "bg-[#00FFFF] translate-x-[1px] translate-y-[1px]" 
                      : "bg-white brutalist-shadow hover:translate-x-[1px] hover:translate-y-[1px]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!title.trim()}
            className="w-full h-20 bg-[#FFE600] border-4 border-black brutalist-shadow text-2xl font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            CREATE TASK_
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;