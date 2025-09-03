import React from 'react';

import { useChat } from './hooks/useChat';
import { ChatHeader, ChatHistory, ChatInput, WelcomeMessage } from './components';

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

  if (toolsError) {
    return <div>Error: {toolsError.message}</div>;
  }

  if (!toolsData?.enabled) {
    return <div>LLM plugin not enabled. Please enable the LLM plugin to use the chat interface.</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ChatHeader clearChat={clearChat} isGenerating={isGenerating} />
      <div
        ref={chatContainerRef}
        className="overflow-y-auto h-[500px] border border-medium rounded-md p-md bg-surface theme-scrollbar mb-md"
        onScroll={handleScroll}
      >
        {chatHistory.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <ChatHistory chatHistory={chatHistory} isGenerating={isGenerating} />
        )}
      </div>
      <ChatInput
        currentInput={currentInput}
        isGenerating={isGenerating}
        toolsLoading={toolsLoading}
        setCurrentInput={setCurrentInput}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
}
