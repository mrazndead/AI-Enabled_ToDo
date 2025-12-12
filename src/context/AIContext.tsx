import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { showError, showSuccess } from '@/utils/toast';

interface AIContextType {
  aiEnabled: boolean;
  googleAIKey: string | null;
  setGoogleAIKey: (key: string | null) => void;
  ai: GoogleGenAI | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [googleAIKey, setGoogleAIKey] = useState<string | null>(() => {
    // Load key from localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('googleAIKey');
    }
    return null;
  });
  
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const aiEnabled = !!googleAIKey;

  useEffect(() => {
    if (googleAIKey) {
      try {
        const genAI = new GoogleGenAI({ apiKey: googleAIKey });
        setAi(genAI);
        localStorage.setItem('googleAIKey', googleAIKey);
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        setAi(null);
        // We keep the key in state/storage but disable AI if initialization fails
      }
    } else {
      setAi(null);
      localStorage.removeItem('googleAIKey');
    }
  }, [googleAIKey]);

  const contextValue = {
    aiEnabled,
    googleAIKey,
    setGoogleAIKey,
    ai,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};