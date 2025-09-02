import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PostgreSQLQueryTool, postgresToolHandlers } from './postgresQueryTool';

// For use in browser environment with the LLM plugin
export class PostgreSQLMCPClient {
  private tools: Tool[];

  constructor() {
    this.tools = Object.values(PostgreSQLQueryTool.getMCPTools());
  }

  async listTools() {
    return {
      tools: this.tools,
    };
  }

  async callTool(request: { name: string; arguments?: any }) {
    const { name, arguments: args } = request;

    try {
      switch (name) {
        case 'list_postgres_tables':
          return await postgresToolHandlers.list_postgres_tables();

        case 'describe_postgres_table':
          if (!args || !args.tableName) {
            throw new Error('tableName argument is required');
          }
          return await postgresToolHandlers.describe_postgres_table(args);

        case 'execute_postgres_query':
          if (!args || !args.query) {
            throw new Error('query argument is required');
          }
          return await postgresToolHandlers.execute_postgres_query(args);

        case 'get_table_count':
          if (!args || !args.tableName) {
            throw new Error('tableName argument is required');
          }
          return await postgresToolHandlers.get_table_count(args);

        case 'get_sample_data':
          if (!args || !args.tableName) {
            throw new Error('tableName argument is required');
          }
          return await postgresToolHandlers.get_sample_data(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
}

// Export singleton instance for use in the plugin
export const postgresMCPClient = new PostgreSQLMCPClient();

// Export utility functions for tool checking
export const isPostgresTool = (toolName: string): boolean => {
  return PostgreSQLQueryTool.isPostgresTool(toolName);
};

export const getPostgresToolNames = (): string[] => {
  return PostgreSQLQueryTool.getToolNames();
};
