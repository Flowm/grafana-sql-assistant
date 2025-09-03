import React from 'react';
import { Button } from '@grafana/ui';

interface ChatHeaderProps {
  clearChat: () => void;
  isGenerating: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ clearChat, isGenerating }) => (
  <div className="flex justify-end items-center mb-md">
    <Button variant="secondary" size="sm" onClick={clearChat} disabled={isGenerating}>
      Clear Chat
    </Button>
  </div>
);
