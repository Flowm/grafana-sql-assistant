import React from 'react';
import { Stack } from '@grafana/ui';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  isGenerating: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, isGenerating }) => (
  <Stack direction="column" gap={1}>
    {chatHistory.map((message, index) => (
      <ChatMessage
        key={index}
        message={message}
        isGenerating={isGenerating}
        isLastMessage={index === chatHistory.length - 1}
      />
    ))}
  </Stack>
);
