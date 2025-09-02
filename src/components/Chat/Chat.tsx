import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner, Stack, TextArea } from '@grafana/ui';
import { useAsync } from 'react-use';
import { finalize, lastValueFrom, partition, startWith } from 'rxjs';
import { llm, mcp } from '@grafana/llm';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types';
import { RenderedToolCall, ChatMessage } from './types';
import { postgresMCPClient, isPostgresTool } from '../../tools/mcpServer';
import { browserTestHelpers } from '../../tools/simpleTest';

interface ChatProps {}

// Helper function to handle tool calls
async function handleToolCall(
  fc: { function: { name: string; arguments: string }; id: string },
  client: any,
  toolCalls: Map<string, RenderedToolCall>,
  setToolCalls: (calls: Map<string, RenderedToolCall>) => void,
  messages: llm.Message[]
) {
  const { function: f, id } = fc;
  console.log('f', f);

  setToolCalls(new Map(toolCalls.set(id, { name: f.name, arguments: f.arguments, running: true })));

  const args = JSON.parse(f.arguments);

  try {
    let response;

    // Check if this is a PostgreSQL tool
    if (isPostgresTool(f.name)) {
      response = await postgresMCPClient.callTool({ name: f.name, arguments: args });
    } else {
      response = await client.callTool({ name: f.name, arguments: args });
    }

    const toolResult = CallToolResultSchema.parse(response);
    const textContent = toolResult.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('');
    messages.push({ role: 'tool', tool_call_id: id, content: textContent });
    setToolCalls(new Map(toolCalls.set(id, { name: f.name, arguments: f.arguments, running: false, response })));
  } catch (e: any) {
    const error = e.message ?? e.toString();
    messages.push({ role: 'tool', tool_call_id: id, content: error });
    setToolCalls(new Map(toolCalls.set(id, { name: f.name, arguments: f.arguments, running: false, error })));
  }
}

export function Chat({}: ChatProps) {
  const { client } = mcp.useMCPClient();

  // Make test helpers available globally
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).postgresTest = browserTestHelpers;
      console.log('🔧 PostgreSQL test helpers loaded! Type "postgresTest.help()" for commands.');
    }
  }, []);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toolCalls, setToolCalls] = useState<Map<string, RenderedToolCall>>(new Map());

  // Ref for auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Get available tools
  const {
    loading: toolsLoading,
    error: toolsError,
    value: toolsData,
  } = useAsync(async () => {
    const enabled = await llm.enabled();
    if (!enabled) {
      return { enabled: false, tools: [] };
    }

    // Get tools from both MCP client and PostgreSQL client
    const mcpTools = (await client?.listTools()) ?? { tools: [] };
    const postgresTools = await postgresMCPClient.listTools();

    // Combine tools
    const allTools = [...mcpTools.tools, ...postgresTools.tools];

    return { enabled: true, tools: allTools };
  }, [client]);

  const handleStreamingChatWithHistory = async (messages: llm.Message[], tools: any[]) => {
    let stream = llm.streamChatCompletions({
      model: llm.Model.LARGE,
      messages,
      tools: mcp.convertToolsToOpenAI(tools),
    });

    let [toolCallsStream, otherMessages] = partition(
      stream,
      (chunk: llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>) => llm.isToolCallsMessage(chunk.choices[0].delta)
    );

    let contentMessages = otherMessages.pipe(
      llm.accumulateContent(),
      finalize(() => {
        console.log('stream finalized');
      })
    );

    // Subscribe to content updates
    contentMessages.subscribe((content) => {
      setChatHistory((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, content } : msg))
      );
    });

    let toolCallMessages = await lastValueFrom(toolCallsStream.pipe(llm.accumulateToolCalls()));

    while (toolCallMessages.tool_calls.length > 0) {
      messages.push(toolCallMessages);

      const tcs = toolCallMessages.tool_calls.filter((tc) => tc.type === 'function');
      await Promise.all(tcs.map((fc) => handleToolCall(fc, client, toolCalls, setToolCalls, messages)));

      stream = llm.streamChatCompletions({
        model: llm.Model.LARGE,
        messages,
        tools: mcp.convertToolsToOpenAI(tools),
      });

      [toolCallsStream, otherMessages] = partition(
        stream,
        (chunk: llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>) => llm.isToolCallsMessage(chunk.choices[0].delta)
      );

      const firstMessage: Partial<llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>> = {
        choices: [{ delta: { role: 'assistant', content: '' } }],
      };

      contentMessages = otherMessages.pipe(
        //@ts-expect-error
        startWith(firstMessage),
        llm.accumulateContent(),
        finalize(() => {
          console.log('stream finalized');
        })
      );

      contentMessages.subscribe((content) => {
        setChatHistory((prev) =>
          prev.map((msg, idx) => (idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, content } : msg))
        );
      });

      toolCallMessages = await lastValueFrom(toolCallsStream.pipe(llm.accumulateToolCalls()));
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || isGenerating || !toolsData?.enabled) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date(),
    };

    // Add user message to history
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentInput('');
    setIsGenerating(true);
    setToolCalls(new Map());

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, assistantMessage]);

    const messages: llm.Message[] = [
      {
        role: 'system',
        content:
          'You are a helpful SQL and data analysis assistant with deep knowledge of Grafana, Prometheus, PostgreSQL, and the general observability ecosystem. You have access to PostgreSQL database tools that allow you to list tables, describe table schemas, execute SELECT queries, count rows, and get sample data. Help users write SQL queries, analyze data, understand their database structure, and gain insights from their metrics. Always use the available database tools to provide accurate and current information about the database structure and data.',
      },
      ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: userMessage.content },
    ];

    try {
      await handleStreamingChatWithHistory(messages, toolsData.tools);
    } catch (error) {
      console.error('Error in chat completion:', error);
      // Update the assistant message with error
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
    setToolCalls(new Map());
  };

  if (toolsError) {
    return <div>Error: {toolsError.message}</div>;
  }

  if (!toolsData?.enabled) {
    return <div>LLM plugin not enabled. Please enable the LLM plugin to use the chat interface.</div>;
  }

  return (
    <Stack direction="column" gap={3}>
      {/* Chat header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>SQL LLM Copilot Chat</h3>
        <Button variant="secondary" size="sm" onClick={clearChat} disabled={isGenerating}>
          Clear Chat
        </Button>
      </div>

      {/* Chat history */}
      <div
        ref={chatContainerRef}
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'var(--background-color-secondary)',
        }}
      >
        {chatHistory.length === 0 ? (
          <div
            style={{
              color: 'var(--text-color-secondary)',
              fontStyle: 'italic',
              textAlign: 'center',
              paddingTop: '20px',
            }}
          >
            <h4>Welcome to SQL LLM Copilot!</h4>
            <p>Start a conversation by asking questions about:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
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
        ) : (
          <Stack direction="column" gap={1}>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '12px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '90%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.role === 'user' ? '#007acc' : 'var(--background-color-primary)',
                    color: message.role === 'user' ? 'white' : 'var(--text-color-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: message.role === 'assistant' ? '1px solid var(--border-color)' : 'none',
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                >
                  {message.content ||
                    (message.role === 'assistant' && isGenerating && index === chatHistory.length - 1 ? (
                      <span style={{ opacity: 0.7 }}>Thinking...</span>
                    ) : (
                      ''
                    ))}
                </div>
              </div>
            ))}
          </Stack>
        )}
      </div>

      {/* Input area */}
      <Stack direction="row" gap={2}>
        <TextArea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.currentTarget.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me to list tables, describe schemas, write SQL queries, analyze data, or help with observability... (Enter to send, Shift+Enter for new line)"
          disabled={isGenerating}
          style={{ flex: 1 }}
          rows={3}
        />
        <Button onClick={sendMessage} disabled={!currentInput.trim() || isGenerating || toolsLoading} variant="primary">
          {isGenerating ? <Spinner size="sm" /> : 'Send'}
        </Button>
      </Stack>

      {/* Tool calls indicator */}
      {toolCalls.size > 0 && (
        <div style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>
          Active tool calls: {Array.from(toolCalls.values()).filter((tc) => tc.running).length}
        </div>
      )}
    </Stack>
  );
}
