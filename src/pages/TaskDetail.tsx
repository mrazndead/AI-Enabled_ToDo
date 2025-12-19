import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Clock, Trash, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TaskDetailItem from '@/components/TaskDetailItem';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { showSuccess } from '@/utils/toast';
import { Category } from '@/hooks/useCategories'; // Import Category type

interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category; // Use dynamic Category type
  time?: string;
  completed: boolean;
  completionTime?: string;
}

// Define colors for default categories, use a fallback for custom ones
const DEFAULT_CATEGORY_COLORS: Record<string, { iconBg: string, text: string }> = {
  Work: { iconBg: "bg-blue-600", text: "text-blue-400" },
  Personal: { iconBg: "bg-pink-600", text: "text-pink-400" },
  Shopping: { iconBg: "bg-green-600", text: "text-green-400" },
};

const getCategoryColors = (category: Category) => {
    if (category in DEFAULT_CATEGORY_COLORS) {
        return DEFAULT_CATEGORY_COLORS[category];
    }
    // Fallback color for custom categories
    return { iconBg: "bg-purple-600", text: "text-purple-400" };
};

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [todos, setTodos] = useLocalStorage<Todo[]>('dyad-todo-tasks', []);
  const navigate = useNavigate();

  const task = todos.find(t => t.id === id);

  if (!task) {
    return (
      <div className="min-h-screen bg-[#101827] text-white p-6">
        <h1 className="text-2xl font-bold">Task Not Found</h1>
        <p className="text-gray-400 mt-2">The task you are looking for does not exist.</p>
        <Link to="/">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Go Home</Button>
        </Link>
      </div>
    );
  }

  const handleToggle = () => {
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
    showSuccess(task.completed ? `Task marked as incomplete: ${task.title}` : `Task completed: ${task.title}`);
  };

  const handleDelete = () => {
    setTodos(todos.filter((t) => t.id !== id));
    showSuccess(`Task deleted: ${task.title}`);
    navigate("/");
  };

  const colorScheme = getCategoryColors(task.category);

  return (
    <div className="min-h-screen bg-[#101827] text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#101827] border-b border-gray-800/50">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white truncate max-w-[70%]">{task.title}</h1>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-red-500 hover:bg-gray-800"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your task: "{task.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-none">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Task Title and Status */}
        <Card className={`mb-6 p-6 border-none shadow-xl ${task.completed ? 'bg-green-900/30' : 'bg-gray-800/50'}`}>
          <CardContent className="p-0">
            <h2 className={`text-2xl font-bold mb-2 ${task.completed ? 'line-through text-gray-300' : 'text-white'}`}>
              {task.title}
            </h2>
            <div className={`text-sm font-medium flex items-center ${task.completed ? 'text-green-400' : 'text-gray-400'}`}>
              <CheckCircle className="h-4 w-4 mr-1" />
              {task.completed ? `Completed at ${task.completionTime}` : 'Pending'}
            </div>
          </CardContent>
        </Card>

        {/* Description/Notes */}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Notes
        </h3>
        <Card className="mb-6 bg-gray-800/50 border-gray-700 shadow-lg">
          <CardContent className="p-4 text-gray-300">
            {task.description && task.description.trim() !== '' ? (
              <p className="whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-gray-500 italic">No detailed notes for this task.</p>
            )}
          </CardContent>
        </Card>

        {/* Detail Items Container */}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Details
        </h3>
        <div className="mb-8 bg-gray-800/50 rounded-xl shadow-lg divide-y divide-gray-700/50">
          
          {/* Due Date (Simplified to Today for now) */}
          <TaskDetailItem
            icon={<Calendar className="h-5 w-5 text-white" />}
            title="Due Date"
            subtitle="Set a deadline"
            value="Today"
            iconBgColor="bg-blue-600"
          />

          {/* Category */}
          <TaskDetailItem
            icon={<Tag className="h-5 w-5 text-white" />}
            title="Category"
            subtitle="Organize your tasks"
            value={task.category}
            iconBgColor={colorScheme.iconBg}
          />
          
          {/* Time (if available) */}
          {task.time && (
            <TaskDetailItem
              icon={<Clock className="h-5 w-5 text-white" />}
              title="Time"
              subtitle="Specific time"
              value={task.time}
              iconBgColor="bg-orange-600"
            />
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={handleToggle}
          className={`w-full h-12 text-lg font-semibold transition-colors 
            ${task.completed 
              ? 'bg-yellow-600 hover:bg-yellow-700' 
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
};

export default TaskDetail;