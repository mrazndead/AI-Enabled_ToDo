export type Category = "Work" | "Personal" | "Shopping";

export const useCategories = () => {
  const categories: Category[] = ["Work", "Personal", "Shopping"];
  const DEFAULT_CATEGORIES: Category[] = ["Work", "Personal", "Shopping"];

  return { categories, DEFAULT_CATEGORIES };
};