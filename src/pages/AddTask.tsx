import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { X, Calendar as CalendarIcon, Tag, Plus } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import TaskDetailItem from "@/components/TaskDetailItem";
import { useCategories, Category } from "@/hooks/useCategories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type CategoryState = Category | 'None';

const categoryColors: Record<Category, string> = {
  Work: "bg-blue-600/20 text-blue-400",
  Personal: "bg-pink-600/20 text-pink-400",
  Shopping: "bg-green-600/20 text-green-400",
};

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
  const { categories, DEFAULT_CATEGORIES } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryState>('None');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined); // Change to Date object
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = {
      id: Date.now().toString(), // Simple unique ID generation
      title: trimmedTitle,
      description: description.trim(),
      category: category === 'None' ? 'Personal' : category,
      time: undefined, // Time setting is not implemented yet
      dueDate: dueDate ? dueDate.toISOString() : undefined, // Store date as ISO string
      completed: false,
      completionTime: undefined,
    };

    // Read existing tasks, add new task, and save back
    const existingTasks = getTasksFromStorage();
    saveTasksToStorage([newTask, ...existingTasks]);
    
    showSuccess(`Task "${trimmedTitle}" added!`);
    
    // Navigate back to home
    navigate("/");
  };

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
  };

  // Helper to get color class for dynamic categories
  const getCategoryColorClass = (cat: Category) => {
    if (cat in categoryColors) {
      return categoryColors[cat as keyof typeof categoryColors];
    }
    // Default color for custom tags
    return "bg-purple-600/20 text-purple-400";
  };

  const QuickTagButton: React.FC<{ tag: Category }> = ({ tag }) => {
    const colorClass = getCategoryColorClass(tag);
    const isActive = category === tag;
    
    return (
      <Button
        variant="outline"
        onClick={() => handleCategorySelect(tag)}
        className={`rounded-full px-4 py-2 h-auto text-sm font-medium transition-colors 
          ${isActive 
            ? `${colorClass} border-2 border-opacity-50` 
            : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }
        `}
      >
        <span className={`h-2 w-2 rounded-full mr-2 ${tag === 'Work' ? 'bg-blue-400' : tag === 'Personal' ? 'bg-pink-400' : tag === 'Shopping' ? 'bg-green-400' : 'bg-purple-400'}`}></span>
        {tag}
      </Button>
    );
  };
  
  const dueDateValue = dueDate 
    ? format(dueDate, "MMM dd, yyyy") 
    : "Set a date";

  return (
    <div className="min-h-screen bg-[#101827] text-white">
      
      {/* Fixed Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#101827] border-b border-gray-800/50">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
            <X className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Add New Task</h1>
        <Button 
          onClick={handleSubmit} 
          className="bg-blue-600 hover:bg-blue-700 font-semibold"
          disabled={!title.trim()}
        >
          Save
        </Button>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Task Title Input Card */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-xl shadow-lg">
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Task Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=""
            required
            className="h-12 text-xl bg-white text-gray-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg placeholder:text-gray-500"
          />
        </div>

        {/* Description Input Card */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-xl shadow-lg">
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, notes, or subtasks..."
            rows={4}
            className="bg-gray-900 border-none text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
          />
        </div>
        
        {/* Detail Items Container */}
        <div className="mb-8 bg-gray-800/50 rounded-xl shadow-lg divide-y divide-gray-700/50">
          
          {/* Due Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              {/* Removed onClick handler to allow PopoverTrigger to work */}
              <TaskDetailItem
                icon={<CalendarIcon className="h-5 w-5 text-white" />}
                title="Due Date"
                subtitle={dueDate ? "Deadline set" : "Set a deadline"}
                value={dueDateValue}
                iconBgColor="bg-blue-600"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 text-white">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="[&_td]:text-white [&_th]:text-gray-400 [&_button]:text-white [&_button:hover]:bg-gray-700"
              />
              <div className="p-2 border-t border-gray-700 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDueDate(undefined)}
                  className="text-red-400 hover:bg-gray-700"
                >
                  Clear Date
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Category */}
          <TaskDetailItem
            icon={<Tag className="h-5 w-5 text-white" />}
            title="Category"
            subtitle="Organize your tasks"
            value={category}
            iconBgColor="bg-purple-600"
            onClick={() => console.log("Open Category Selector")}
          />
        </div>

        {/* Quick Tags */}
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Quick Tags
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(tag => (
            <QuickTagButton key={tag} tag={tag} />
          ))}
          
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-dashed border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;