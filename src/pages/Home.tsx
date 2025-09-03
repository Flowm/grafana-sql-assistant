import React, { Suspense } from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { mcp } from '@grafana/llm';
import { Chat } from '../components/Chat';

function Home() {
  return (
    <PluginPage>
      <div data-testid={testIds.home.container} className="min-h-screen bg-background p-md">
        <div className="max-w-6xl mx-auto">
          <div className="grafana-panel p-lg mb-lg">
            <h1 className="text-xl font-bold text-primary mb-md">SQL LLM Copilot</h1>
            <div className="border border-weak rounded-md p-md bg-surface">
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
          </div>
        </div>
      </div>
    </PluginPage>
  );
}

export default Home;
