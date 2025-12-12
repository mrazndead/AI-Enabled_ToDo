import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAI } from '@/context/AIContext';
import { showSuccess, showError } from '@/utils/toast';
import { Brain, X } from 'lucide-react';

interface AISettingsDialogProps {
  children: React.ReactNode;
}

const AISettingsDialog: React.FC<AISettingsDialogProps> = ({ children }) => {
  const { googleAIKey, setGoogleAIKey, aiEnabled } = useAI();
  const [inputKey, setInputKey] = useState(googleAIKey || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (googleAIKey) {
      setInputKey(googleAIKey);
    }
  }, [googleAIKey]);

  const handleSave = () => {
    if (inputKey.trim()) {
      setGoogleAIKey(inputKey.trim());
      showSuccess("AI Key saved! Smart features are now enabled.");
      setIsOpen(false);
    } else {
      showError("Please enter a valid Google AI Key.");
    }
  };

  const handleDisable = () => {
    setGoogleAIKey(null);
    setInputKey('');
    showSuccess("AI features disabled.");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-400" />
            Smart Task Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your Google AI API Key to enable smart task features like categorization and suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ai-key" className="text-right text-gray-300 col-span-4 sm:col-span-1">
              API Key
            </Label>
            <Input
              id="ai-key"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="col-span-4 sm:col-span-3 bg-gray-800 border-gray-700 text-white"
              placeholder="AI2zaSy..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your key is stored locally in your browser and is not sent to our servers.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between pt-4">
          {aiEnabled ? (
            <Button variant="destructive" onClick={handleDisable} className="w-full sm:w-auto mb-2 sm:mb-0">
              <X className="h-4 w-4 mr-2" /> Disable AI
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            {aiEnabled ? 'Update Key' : 'Enable AI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISettingsDialog;