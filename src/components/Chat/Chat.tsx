import React, { useRef } from 'react';

import { useChat } from './hooks/useChat';
import { ChatHeader, ChatHistory, ChatInput, WelcomeMessage } from './components';
import { ChatInputRef } from './components/ChatInput/ChatInput';

export function Chat() {
  const {
    chatHistory,
    currentInput,
    isGenerating,
    chatContainerRef,
    toolsLoading,
    toolsError,
    toolsData,
    setCurrentInput,
    sendMessage,
    handleKeyPress,
    clearChat,
    handleScroll,
  } = useChat();

  const chatInputRef = useRef<ChatInputRef>(null);

  const handleSuggestionClick = (message: string) => {
    setCurrentInput(message);
    // Focus the input after setting the message
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  };

  if (toolsError) {
    return <div>Error: {toolsError.message}</div>;
  }

  if (!toolsData?.enabled) {
    return <div>LLM plugin not enabled. Please enable the LLM plugin to use the chat interface.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
      <ChatHeader clearChat={clearChat} isGenerating={isGenerating} />

      <div className="flex-1 flex flex-col min-h-0">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 mb-lg" onScroll={handleScroll}>
          {chatHistory.length === 0 ? (
            <WelcomeMessage onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatHistory chatHistory={chatHistory} isGenerating={isGenerating} />
          )}
        </div>

        <div className="flex-shrink-0">
          <ChatInput
            ref={chatInputRef}
            currentInput={currentInput}
            isGenerating={isGenerating}
            toolsLoading={toolsLoading}
            setCurrentInput={setCurrentInput}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
}
