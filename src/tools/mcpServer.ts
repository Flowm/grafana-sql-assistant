import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { postgresQueryTool } from './postgresQueryTool';

// For use in browser environment with the LLM plugin
export class PostgreSQLMCPClient {
  private tools: Tool[];

  // Static tool definitions
  private static readonly TOOL_DEFINITIONS: Tool[] = [
    {
      name: 'sql_list_tables',
      description: 'List all tables in the PostgreSQL database',
      inputSchema: {
        type: 'object' as const,
        properties: {},
        required: [],
      },
    },
    {
      name: 'sql_describe_table',
      description: 'Get the schema/structure of a specific PostgreSQL table',
      inputSchema: {
        type: 'object' as const,
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to describe',
          },
        },
        required: ['tableName'],
      },
    },
    {
      name: 'sql_get_table_row_count',
      description: 'Get the number of rows in a specific SQL table',
      inputSchema: {
        type: 'object' as const,
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to count rows for',
          },
        },
        required: ['tableName'],
      },
    },
    {
      name: 'sql_get_sample_data',
      description: 'Get sample data from a specific SQL table',
      inputSchema: {
        type: 'object' as const,
        properties: {
          tableName: {
            type: 'string',
            description: 'Name of the table to get sample data from',
          },
          limit: {
            type: 'number',
            description: 'Number of rows to return (default: 10, max: 100)',
            minimum: 1,
            maximum: 100,
          },
        },
        required: ['tableName'],
      },
    },
    {
      name: 'sql_execute_query',
      description: 'Execute a custom SQL query against the database',
      inputSchema: {
        type: 'object' as const,
        properties: {
          query: {
            type: 'string',
            description: 'SQL query to execute',
          },
        },
        required: ['query'],
      },
    },
  ];

  constructor() {
    this.tools = PostgreSQLMCPClient.TOOL_DEFINITIONS;
  }

  isTool(toolName: string): boolean {
    return this.tools.some((tool) => tool.name === toolName);
  }

  listTools() {
    return {
      tools: this.tools,
    };
  }

  async callTool(request: { name: string; arguments?: any }) {
    const { name, arguments: args } = request;

    try {
      // Route to the appropriate handler method
      switch (name) {
        case 'sql_list_tables':
          return await this.handleListTables(args);
        case 'sql_describe_table':
          return await this.handleDescribeTable(args);
        case 'sql_get_table_row_count':
          return await this.handleGetTableRowCount(args);
        case 'sql_get_sample_data':
          return await this.handleGetSampleData(args);
        case 'sql_execute_query':
          return await this.handleExecuteQuery(args);
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

  // Handler methods for each tool
  private async handleListTables(args?: any) {
    const tables = await postgresQueryTool.listTables();
    return {
      content: [
        {
          type: 'text',
          text: `Found ${tables.length} tables in the database:\n${tables.map((table) => `- ${table}`).join('\n')}`,
        },
      ],
    };
  }

  private async handleDescribeTable(args: { tableName: string }) {
    if (!args || !args.tableName) {
      throw new Error('tableName argument is required');
    }

    const columns = await postgresQueryTool.describeTable(args.tableName);
    const columnInfo = columns
      .map(
        (col) =>
          `${col.column_name} (${col.data_type}${
            col.character_maximum_length ? `(${col.character_maximum_length})` : ''
          }) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}${
            col.column_default ? ` DEFAULT ${col.column_default}` : ''
          }`
      )
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Table "${args.tableName}" structure:\n${columnInfo}`,
        },
      ],
    };
  }

  private async handleGetTableRowCount(args: { tableName: string }) {
    if (!args || !args.tableName) {
      throw new Error('tableName argument is required');
    }

    const count = await postgresQueryTool.getTableRowCount(args.tableName);

    return {
      content: [
        {
          type: 'text',
          text: `Table "${args.tableName}" contains ${count} rows`,
        },
      ],
    };
  }

  private async handleGetSampleData(args: { tableName: string; limit?: number }) {
    if (!args || !args.tableName) {
      throw new Error('tableName argument is required');
    }

    const limit = Math.min(args.limit || 10, 100);
    const data = await postgresQueryTool.getSampleData(args.tableName, limit);

    return {
      content: [
        {
          type: 'text',
          text: `Sample data from "${args.tableName}" (${data.length} rows):\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  private async handleExecuteQuery(args: { query: string }) {
    if (!args || !args.query) {
      throw new Error('query argument is required');
    }

    const result = await postgresQueryTool.executeQuery(args.query);

    return {
      content: [
        {
          type: 'text',
          text: `Query executed successfully. Result:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }
}

// Export singleton instance for use in the plugin
export const postgresMCPClient = new PostgreSQLMCPClient();
