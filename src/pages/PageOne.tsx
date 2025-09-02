import React, { Suspense } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2, LoadingPlaceholder } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { ROUTES } from '../constants';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { mcp } from '@grafana/llm';
import { Chat } from '../components/Chat';

function PageOne() {
  const s = useStyles2(getStyles);

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container}>
        <div className={s.header}>
          <h2>SQL LLM Copilot</h2>
          <p>Your AI assistant for SQL queries, data analysis, and observability insights.</p>
        </div>

        <div className={s.chatContainer}>
          <Suspense fallback={<LoadingPlaceholder text="Loading MCP..." />}>
            <mcp.MCPClientProvider appName="SQL LLM Copilot" appVersion="1.0.0">
              <Chat useStream={true} />
            </mcp.MCPClientProvider>
          </Suspense>
        </div>

        <div className={s.marginTop}>
          <LinkButton data-testid={testIds.pageOne.navigateToFour} href={prefixRoute(ROUTES.Four)}>
            Full-width page example
          </LinkButton>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageOne;

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
  header: css`
    margin-bottom: ${theme.spacing(3)};
    text-align: center;

    h2 {
      margin-bottom: ${theme.spacing(1)};
      color: ${theme.colors.text.primary};
    }

    p {
      color: ${theme.colors.text.secondary};
      margin: 0;
    }
  `,
  chatContainer: css`
    max-width: 1200px;
    margin: 0 auto ${theme.spacing(4)} auto;
    padding: ${theme.spacing(2)};
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
  `,
});
