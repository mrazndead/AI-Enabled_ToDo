export type Category = "Work" | "Money" | "Errand";

export const useCategories = () => {
  const categories: Category[] = ["Work", "Money", "Errand"];
  const DEFAULT_CATEGORIES: Category[] = ["Work", "Money", "Errand"];

  return { categories, DEFAULT_CATEGORIES };
};