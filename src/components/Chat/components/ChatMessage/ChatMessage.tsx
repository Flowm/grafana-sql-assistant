import React from 'react';
import { Streamdown } from 'streamdown';
import { ToolCallsSection } from '../ToolCallsSection/ToolCallsSection';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isGenerating?: boolean;
  isLastMessage?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isGenerating = false, isLastMessage = false }) => {
  const showThinking = message.role === 'assistant' && isGenerating && isLastMessage && !message.content;

  const messageClasses =
    message.role === 'user'
      ? 'max-w-[90%] p-md rounded-lg chat-message-user whitespace-pre-wrap break-words shadow-grafana-md text-sm leading-relaxed'
      : 'max-w-[90%] p-md rounded-lg chat-message-assistant whitespace-pre-wrap break-words shadow-grafana-md border text-sm leading-relaxed';

  return (
    <div className={`flex flex-row mb-3 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={messageClasses}>
        {message.role === 'assistant' && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallsSection toolCalls={message.toolCalls} />
        )}
        {showThinking ? (
          <span className="opacity-70 italic text-secondary">Thinking...</span>
        ) : (
          <div className="text-sm leading-relaxed text-primary whitespace-normal break-words overflow-x-auto">
            <Streamdown>{message.content}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
};
