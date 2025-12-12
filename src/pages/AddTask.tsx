import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { X, Calendar, Tag, Plus, Brain } from "lucide-react";
import { showSuccess, showLoading, dismissToast } from "@/utils/toast";
import TaskDetailItem from "@/components/TaskDetailItem";
import { useAITasks } from "@/hooks/use-ai-tasks";

type Category = 'Work' | 'Personal' | 'Shopping';

const categoryColors: Record<Category, string> = {
  Work: "bg-blue-600/20 text-blue-400",
  Personal: "bg-pink-600/20 text-pink-400",
  Shopping: "bg-green-600/20 text-green-400",
};

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | 'None'>('None');
  const [dueDate, setDueDate] = useState("Today"); // Simplified state for now
  const navigate = useNavigate();
  const { aiEnabled, categorizeAndCleanTask } = useAITasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // Simulate saving the task
    console.log("Task saved:", { title, description, category, dueDate });
    showSuccess(`Task "${title}" added!`);
    
    // Navigate back to home
    navigate("/");
  };

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
  };

  const handleAICategorization = async () => {
    if (!title.trim() && !description.trim()) return;

    const loadingToastId = showLoading("Analyzing task with AI...");
    
    try {
      const result = await categorizeAndCleanTask(title, description);
      
      if (result) {
        setTitle(result.cleanedTitle);
        setCategory(result.suggestedCategory);
        showSuccess("AI analysis complete: Title cleaned and category suggested!");
      }
    } finally {
      dismissToast(loadingToastId);
    }
  };

  const QuickTagButton: React.FC<{ tag: Category }> = ({ tag }) => {
    const colorClass = categoryColors[tag];
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
        <span className={`h-2 w-2 rounded-full mr-2 ${tag === 'Work' ? 'bg-blue-400' : tag === 'Personal' ? 'bg-pink-400' : tag === 'Shopping' ? 'bg-green-400' : ''}`}></span>
        {tag}
      </Button>
    );
  };

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
        
        {/* AI Button */}
        {aiEnabled && (
          <div className="mb-6">
            <Button 
              onClick={handleAICategorization} 
              variant="outline" 
              className="w-full bg-gray-800 border-gray-700 text-blue-400 hover:bg-gray-700"
              disabled={!title.trim() && !description.trim()}
            >
              <Brain className="h-4 w-4 mr-2" />
              Analyze & Categorize with AI
            </Button>
          </div>
        )}

        {/* Detail Items Container */}
        <div className="mb-8 bg-gray-800/50 rounded-xl shadow-lg divide-y divide-gray-700/50">
          
          {/* Due Date */}
          <TaskDetailItem
            icon={<Calendar className="h-5 w-5 text-white" />}
            title="Due Date"
            subtitle="Set a deadline"
            value={dueDate}
            iconBgColor="bg-blue-600"
            onClick={() => console.log("Open Date Picker")}
          />

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
          <QuickTagButton tag="Work" />
          <QuickTagButton tag="Personal" />
          <QuickTagButton tag="Shopping" />
          
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-dashed border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;