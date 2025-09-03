import React, { Suspense } from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { mcp } from '@grafana/llm';
import { Chat } from '../components/Chat';

function Home() {
  return (
    <PluginPage>
      <div data-testid={testIds.home.container} className="p-md">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-xl">
              <div className="text-lg text-secondary">Loading MCP...</div>
            </div>
          }
        >
          <mcp.MCPClientProvider appName="SQL LLM Copilot" appVersion="1.0.0">
            <Chat />
          </mcp.MCPClientProvider>
        </Suspense>
      </div>
    </PluginPage>
  );
}

export default Home;
