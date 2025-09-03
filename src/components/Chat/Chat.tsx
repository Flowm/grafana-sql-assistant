import React from 'react';
import { Button, Spinner, Stack, TextArea } from '@grafana/ui';
import { useChat } from './useChat';
import { ChatMessage } from './types';
import {
  welcomeMessageStyles,
  chatHistoryStyles,
  chatMessageWrapperStyles,
  chatMessageStyles,
  thinkingStyles,
  chatHeaderStyles,
  chatInputStyles,
  toolCallsIndicatorStyles,
  welcomeListStyles,
} from './Chat.styles';

const WelcomeMessage = () => (
  <div style={welcomeMessageStyles}>
    <h4>Welcome to SQL LLM Copilot!</h4>
    <p>Start a conversation by asking questions about:</p>
    <ul style={welcomeListStyles}>
      <li>Listing database tables</li>
      <li>Exploring table schemas and structure</li>
      <li>Writing SQL queries</li>
      <li>Analyzing your data</li>
      <li>Getting sample data from tables</li>
      <li>Grafana dashboards and panels</li>
      <li>Prometheus metrics</li>
      <li>Observability best practices</li>
    </ul>
  </div>
);

const ChatHistory = ({ chatHistory, isGenerating }: { chatHistory: ChatMessage[]; isGenerating: boolean }) => (
  <Stack direction="column" gap={1}>
    {chatHistory.map((message, index) => (
      <div key={index} style={chatMessageWrapperStyles}>
        <div style={chatMessageStyles(message.role)}>
          {message.content ||
            (message.role === 'assistant' && isGenerating && index === chatHistory.length - 1 ? (
              <span style={thinkingStyles}>Thinking...</span>
            ) : (
              ''
            ))}
        </div>
      </div>
    ))}
  </Stack>
);

const ChatHeader = ({ clearChat, isGenerating }: { clearChat: () => void; isGenerating: boolean }) => (
  <div style={chatHeaderStyles}>
    <h3 style={{ margin: 0 }}>SQL LLM Copilot Chat</h3>
    <Button variant="secondary" size="sm" onClick={clearChat} disabled={isGenerating}>
      Clear Chat
    </Button>
  </div>
);

const ChatInput = ({
  currentInput,
  isGenerating,
  toolsLoading,
  setCurrentInput,
  sendMessage,
  handleKeyPress,
}: {
  currentInput: string;
  isGenerating: boolean;
  toolsLoading: boolean;
  setCurrentInput: (value: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
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

export function Chat() {
  const {
    chatHistory,
    currentInput,
    isGenerating,
    chatContainerRef,
    toolCalls,
    toolsLoading,
    toolsError,
    toolsData,
    setCurrentInput,
    sendMessage,
    handleKeyPress,
    clearChat,
    getRunningToolCallsCount,
  } = useChat();

  if (toolsError) {
    return <div>Error: {toolsError.message}</div>;
  }

  if (!toolsData?.enabled) {
    return <div>LLM plugin not enabled. Please enable the LLM plugin to use the chat interface.</div>;
  }

  return (
    <Stack direction="column" gap={3}>
      <ChatHeader clearChat={clearChat} isGenerating={isGenerating} />
      <div ref={chatContainerRef} style={chatHistoryStyles}>
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
      {toolCalls.size > 0 && (
        <div style={toolCallsIndicatorStyles}>Active tool calls: {getRunningToolCallsCount()}</div>
      )}
    </Stack>
  );
}
