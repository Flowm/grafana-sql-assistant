import { useState, useRef, useEffect } from 'react';
import { llm } from '@grafana/llm';
import { ChatMessage } from './types';
import { useMCPManager } from './useMCPManager';
import { useStreamManager } from './useStreamManager';

const SYSTEM_PROMPT = `
You are a helpful SQL and data analysis assistant with deep knowledge of Grafana, Prometheus, PostgreSQL, and the general observability ecosystem.

You have access to PostgreSQL database tools that allow you to:
- List tables
- Describe table schemas
- Execute SELECT queries
- Count rows
- Get sample data

Help users write SQL queries, analyze data, understand their database structure, and gain insights from their metrics.

Always use the available database tools to provide accurate and current information about the database structure and data.
`;

export const useChat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    toolCalls,
    toolsLoading,
    toolsError,
    toolsData,
    clearToolCalls,
    handleToolCalls,
    getRunningToolCallsCount,
    formatToolsForOpenAI,
  } = useMCPManager();
  const { handleStreamingChatWithHistory } = useStreamManager(setChatHistory, handleToolCalls, formatToolsForOpenAI);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!currentInput.trim() || isGenerating || !toolsData?.enabled) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
    };

    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setCurrentInput('');
    setIsGenerating(true);
    clearToolCalls();

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolCalls: [],
    };

    setChatHistory((prev) => [...prev, assistantMessage]);

    const messages: llm.Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...newChatHistory.map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    try {
      await handleStreamingChatWithHistory(messages, toolsData.tools);
    } catch (error) {
      console.error('Error in chat completion:', error);
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.role === 'assistant'
            ? { ...msg, content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    clearToolCalls();
  };

  // Update chat history with tool calls
  const updateToolCallsInChatHistory = (toolCallsMap: Map<string, any>) => {
    const toolCallsArray = Array.from(toolCallsMap.values());
    setChatHistory((prev) =>
      prev.map((msg, idx) =>
        idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, toolCalls: toolCallsArray } : msg
      )
    );
  };

  // Watch for tool calls changes and update chat history
  useEffect(() => {
    if (toolCalls.size > 0) {
      updateToolCallsInChatHistory(toolCalls);
    } else {
      // Clear tool calls from the last assistant message when tool calls are cleared
      setChatHistory((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, toolCalls: [] } : msg))
      );
    }
  }, [toolCalls]);

  return {
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
  };
};
