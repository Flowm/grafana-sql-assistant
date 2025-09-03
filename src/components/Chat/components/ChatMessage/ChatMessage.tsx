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
  const isUser = message.role === 'user';

  if (isUser) {
    // User messages: ChatGPT-style bubble
    return (
      <div className="flex w-full justify-end mb-4">
        <div className="max-w-[70%]">
          <div className="user-message-bubble px-4 py-3 rounded-2xl rounded-br-md shadow-md">
            <div className="text-sm leading-relaxed whitespace-normal break-words font-medium">{message.content}</div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant messages: Plain text like ChatGPT
  return (
    <div className="flex w-full mb-6">
      <div className="w-full max-w-none">
        {/* Tool Calls Section */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-4">
            <ToolCallsSection toolCalls={message.toolCalls} />
          </div>
        )}

        {/* Message Content */}
        {showThinking ? (
          <div className="flex items-center gap-2 text-secondary">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="italic">Thinking...</span>
          </div>
        ) : (
          <div className="text-primary text-sm leading-relaxed whitespace-normal break-words">
            <Streamdown>{message.content}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
};
