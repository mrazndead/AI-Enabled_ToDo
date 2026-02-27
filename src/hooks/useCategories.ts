export type Category = "Work" | "$" | "Travel" | "Misc";

export const useCategories = () => {
  const categories: Category[] = ["Work", "$", "Travel", "Misc"];
  const DEFAULT_CATEGORIES: Category[] = ["Work", "$", "Travel", "Misc"];

  return { categories, DEFAULT_CATEGORIES };
};