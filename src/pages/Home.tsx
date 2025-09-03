import React, { Suspense } from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { mcp } from '@grafana/llm';
import { Chat } from '../components/Chat';

function Home() {
  return (
    <PluginPage>
      <div data-testid={testIds.home.container} className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">SQL LLM Copilot</h1>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="text-lg text-gray-600">Loading MCP...</div>
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
