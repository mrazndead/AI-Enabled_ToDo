import { useLocalStorage } from './use-local-storage';

export type Category = 'Work' | 'Personal' | 'Shopping' | string;

const DEFAULT_CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping'];

export const useCategories = () => {
  const [categories, setCategories] = useLocalStorage<Category[]>('dyad-task-categories', DEFAULT_CATEGORIES);

  const addCategory = (newCategory: string) => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories([...categories, trimmedCategory]);
      return true;
    }
    return false;
  };

  const deleteCategory = (categoryToDelete: Category) => {
    // Prevent deleting default categories
    if (DEFAULT_CATEGORIES.includes(categoryToDelete)) {
      return false;
    }
    setCategories(categories.filter(c => c !== categoryToDelete));
    return true;
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    DEFAULT_CATEGORIES,
  };
};