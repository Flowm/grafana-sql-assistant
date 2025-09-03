import React from 'react';
import { Button, Spinner, Stack, TextArea } from '@grafana/ui';
import { chatInputStyles } from './ChatInput.styles';

interface ChatInputProps {
  currentInput: string;
  isGenerating: boolean;
  toolsLoading: boolean;
  setCurrentInput: (value: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentInput,
  isGenerating,
  toolsLoading,
  setCurrentInput,
  sendMessage,
  handleKeyPress,
}) => (
  <Stack direction="row" gap={2}>
    <TextArea
      value={currentInput}
      onChange={(e) => setCurrentInput(e.currentTarget.value)}
      onKeyDown={handleKeyPress}
      placeholder="Ask me to list tables, describe schemas, write SQL queries, analyze data, or help with observability... (Enter to send, Shift+Enter for new line)"
      disabled={isGenerating}
      style={chatInputStyles}
      rows={3}
    />
    <Button onClick={sendMessage} disabled={!currentInput.trim() || isGenerating || toolsLoading} variant="primary">
      {isGenerating ? <Spinner size="sm" /> : 'Send'}
    </Button>
  </Stack>
);
