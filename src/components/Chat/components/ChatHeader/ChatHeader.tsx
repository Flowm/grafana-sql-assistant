import React from 'react';
import { Button } from '@grafana/ui';

interface ChatHeaderProps {
  clearChat: () => void;
  isGenerating: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ clearChat, isGenerating }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">SQL LLM Copilot Chat</h3>
    <Button variant="secondary" size="sm" onClick={clearChat} disabled={isGenerating}>
      Clear Chat
    </Button>
  </div>
);
