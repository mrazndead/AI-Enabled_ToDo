import { useAI } from '@/context/AIContext';
import { showError } from '@/utils/toast';

type Category = 'Work' | 'Personal' | 'Shopping';

interface AITaskResponse {
  cleanedTitle: string;
  suggestedCategory: Category;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping'];

export const useAITasks = () => {
  const { ai, aiEnabled } = useAI();

  const categorizeAndCleanTask = async (title: string, description: string): Promise<AITaskResponse | null> => {
    if (!aiEnabled || !ai) {
      return null;
    }

    const prompt = `Analyze the following task title and description. 
    1. Clean up the title to be concise (max 8 words).
    2. Suggest the best category from the following list: ${CATEGORIES.join(', ')}.
    
    Task Title: "${title}"
    Task Description: "${description}"
    
    Respond ONLY with a JSON object matching the TypeScript interface AITaskResponse:
    interface AITaskResponse {
      cleanedTitle: string;
      suggestedCategory: Category;
    }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText) as AITaskResponse;
      
      // Basic validation
      if (result.cleanedTitle && CATEGORIES.includes(result.suggestedCategory)) {
        return result;
      }
      
      showError("AI returned an invalid format.");
      return null;

    } catch (error) {
      console.error("AI Categorization Error:", error);
      showError("Failed to communicate with Google AI. Check your API key or network connection.");
      return null;
    }
  };

  return {
    aiEnabled,
    categorizeAndCleanTask,
  };
};