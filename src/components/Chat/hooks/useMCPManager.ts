import { useState, useCallback } from 'react';
import { useAsync } from 'react-use';
import { llm, mcp } from '@grafana/llm';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types';
import { sqlMCPClient } from '../../../tools/sqlMCPServer';
import { RenderedToolCall } from '../types';
import { ALLOWED_GRAFANA_TOOLS } from '../constants';

export const useMCPManager = () => {
  const { client: grafanaMCPClient } = mcp.useMCPClient();
  const [toolCalls, setToolCalls] = useState<Map<string, RenderedToolCall>>(new Map());

  const clearToolCalls = useCallback(() => {
    setToolCalls(new Map());
  }, []);

  const getAvailableTools = useCallback(async () => {
    const enabled = await llm.enabled();
    if (!enabled) {
      return { enabled: false, tools: [] };
    }

    try {
      const grafanaTools = (await grafanaMCPClient?.listTools()) ?? { tools: [] };
      const filteredGrafanaTools = grafanaTools.tools.filter((tool: any) => ALLOWED_GRAFANA_TOOLS.includes(tool.name));

      const sqlTools = await sqlMCPClient.listTools();
      const allTools = [...filteredGrafanaTools, ...sqlTools.tools];

      return { enabled: true, tools: allTools };
    } catch (error) {
      console.error('Error fetching tools:', error);
      return { enabled: true, tools: [] };
    }
  }, [grafanaMCPClient]);

  const handleToolCall = useCallback(
    async (toolCall: { function: { name: string; arguments: string }; id: string }, messages: llm.Message[]) => {
      const { function: f, id } = toolCall;
      console.log('Handling tool call:', f);

      setToolCalls((prev) => new Map(prev).set(id, { name: f.name, arguments: f.arguments, running: true }));

      const args = JSON.parse(f.arguments);

      try {
        let response;

        if (sqlMCPClient.isTool(f.name)) {
          response = await sqlMCPClient.callTool({ name: f.name, arguments: args });
        } else if (grafanaMCPClient) {
          response = await grafanaMCPClient.callTool({ name: f.name, arguments: args });
        } else {
          throw new Error('No MCP client found for tool: ' + f.name);
        }

        const toolResult = CallToolResultSchema.parse(response);
        const textContent = toolResult.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join('');

        messages.push({ role: 'tool', tool_call_id: id, content: textContent });

        setToolCalls((prev) => new Map(prev).set(id, { ...prev.get(id)!, running: false, response }));
      } catch (error: any) {
        const errorMessage = error.message ?? error.toString();
        console.error('Tool call error:', errorMessage);

        messages.push({ role: 'tool', tool_call_id: id, content: errorMessage });

        setToolCalls((prev) => new Map(prev).set(id, { ...prev.get(id)!, running: false, error: errorMessage }));
      }
    },
    [grafanaMCPClient]
  );

  const handleToolCalls = useCallback(
    async (
      toolCalls: Array<{ function: { name: string; arguments: string }; id: string }>,
      messages: llm.Message[]
    ) => {
      const functionCalls = toolCalls.filter((tc) => tc.function);
      await Promise.all(functionCalls.map((fc) => handleToolCall(fc, messages)));
    },
    [handleToolCall]
  );

  const getRunningToolCallsCount = useCallback(() => {
    return Array.from(toolCalls.values()).filter((tc) => tc.running).length;
  }, [toolCalls]);

  const hasRunningToolCalls = useCallback(() => {
    return getRunningToolCallsCount() > 0;
  }, [getRunningToolCallsCount]);

  const formatToolsForOpenAI = (tools: any[]) => {
    return mcp.convertToolsToOpenAI(tools);
  };

  const {
    loading: toolsLoading,
    error: toolsError,
    value: toolsData,
  } = useAsync(getAvailableTools, [getAvailableTools]);

  return {
    toolCalls,
    toolsLoading,
    toolsError,
    toolsData,
    clearToolCalls,
    handleToolCall,
    handleToolCalls,
    getRunningToolCallsCount,
    hasRunningToolCalls,
    formatToolsForOpenAI,
    getAvailableTools,
  };
};
