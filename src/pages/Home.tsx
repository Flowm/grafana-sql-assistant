import React, { Suspense } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, LoadingPlaceholder } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { mcp } from '@grafana/llm';
import { Chat } from '../components/Chat';

function Home() {
  const s = useStyles2(getStyles);

  return (
    <PluginPage>
      <div data-testid={testIds.home.container}>
        <div className={s.chatContainer}>
          <Suspense fallback={<LoadingPlaceholder text="Loading MCP..." />}>
            <mcp.MCPClientProvider appName="SQL LLM Copilot" appVersion="1.0.0">
              <Chat />
            </mcp.MCPClientProvider>
          </Suspense>
        </div>
      </div>
    </PluginPage>
  );
}

export default Home;

const getStyles = (theme: GrafanaTheme2) => ({
  chatContainer: css`
    max-width: 1200px;
    margin: 0 auto ${theme.spacing(4)} auto;
    padding: ${theme.spacing(2)};
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
  `,
});
