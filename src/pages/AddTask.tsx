import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";

type Category = 'Work' | 'Personal' | 'Family';

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>('Work');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving the task
    console.log("Task saved:", { title, description, category });
    showSuccess(`Task "${title}" added!`);
    
    // Reset form
    setTitle("");
    setDescription("");
    
    // Navigate back to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#101827] text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-4 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Add New Task</h1>
        </header>

        <form onSubmit={handleSubmit}>
          
          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
              Task Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Category Select */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={4}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Save Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;