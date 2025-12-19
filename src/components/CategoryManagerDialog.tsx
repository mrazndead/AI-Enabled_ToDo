import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategories, Category } from '@/hooks/useCategories';
import { showSuccess, showError } from '@/utils/toast';
import { Tag, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryManagerDialogProps {
  children: React.ReactNode;
}

const CategoryManagerDialog: React.FC<CategoryManagerDialogProps> = ({ children }) => {
  const { categories, addCategory, deleteCategory, DEFAULT_CATEGORIES } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const success = addCategory(newCategoryName.trim());
    if (success) {
      showSuccess(`Category '${newCategoryName.trim()}' added.`);
      setNewCategoryName('');
    } else {
      showError(`Category '${newCategoryName.trim()}' already exists.`);
    }
  };
  
  const handleDeleteCategory = (category: Category) => {
    const success = deleteCategory(category);
    if (success) {
      showSuccess(`Category '${category}' deleted.`);
    } else {
      showError(`Cannot delete default category: '${category}'.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Tag className="h-5 w-5 mr-2 text-purple-400" />
            Manage Categories
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add or remove custom tags for organizing your tasks.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Current Categories List */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            <Label className="text-gray-300">Current Categories:</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div 
                  key={category} 
                  className={cn(
                    "flex items-center px-3 py-1 text-sm rounded-full border",
                    DEFAULT_CATEGORIES.includes(category) 
                      ? "bg-gray-700 border-gray-600 text-gray-300" 
                      : "bg-purple-800/50 border-purple-700 text-purple-300"
                  )}
                >
                  {category}
                  {!DEFAULT_CATEGORIES.includes(category) && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 p-0 text-purple-300 hover:bg-purple-700/50"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Category Input */}
          <div className="flex space-x-2 pt-2">
            <Input
              id="new-category"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white"
              placeholder="e.g., Fitness, Finance"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory();
                }
              }}
            />
            <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagerDialog;