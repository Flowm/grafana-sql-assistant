import React from 'react';
import { Button } from '@grafana/ui';
import { chatHeaderStyles, chatHeaderTitleStyles } from './ChatHeader.styles';

interface ChatHeaderProps {
  clearChat: () => void;
  isGenerating: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ clearChat, isGenerating }) => (
  <div style={chatHeaderStyles}>
    <h3 style={chatHeaderTitleStyles}>SQL LLM Copilot Chat</h3>
    <Button variant="secondary" size="sm" onClick={clearChat} disabled={isGenerating}>
      Clear Chat
    </Button>
  </div>
);
