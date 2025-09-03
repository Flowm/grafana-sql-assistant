import React from 'react';
import { Streamdown } from 'streamdown';
import { ToolCallsSection } from '../ToolCallsSection/ToolCallsSection';
import { ChatMessage as ChatMessageType } from '../../types';
import {
  chatMessageWrapperStyles,
  chatMessageStyles,
  thinkingStyles,
  streamdownWrapperStyles,
} from './ChatMessage.styles';

interface ChatMessageProps {
  message: ChatMessageType;
  isGenerating?: boolean;
  isLastMessage?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isGenerating = false, isLastMessage = false }) => {
  const showThinking = message.role === 'assistant' && isGenerating && isLastMessage && !message.content;

  return (
    <div style={chatMessageWrapperStyles}>
      <div style={chatMessageStyles(message.role)}>
        {message.role === 'assistant' && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallsSection toolCalls={message.toolCalls} />
        )}
        {showThinking ? (
          <span style={thinkingStyles}>Thinking...</span>
        ) : (
          <div style={streamdownWrapperStyles}>
            <Streamdown>{message.content}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
};
