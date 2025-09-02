import { getDataSourceSrv } from '@grafana/runtime';
import { DataQueryRequest, dateTime } from '@grafana/data';
import { firstValueFrom } from 'rxjs';

export interface PostgreSQLQueryToolOptions {
  datasourceName?: string;
}

export class PostgreSQLQueryTool {
  private datasourceName: string;

  constructor(options: PostgreSQLQueryToolOptions = {}) {
    this.datasourceName = options.datasourceName || 'PostgreSQL';
  }

  async listTables(): Promise<string[]> {
    try {
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `;

      const result = await this.executeQuery(query);
      return result.map((row: any) => row.table_name);
    } catch (error) {
      console.error('Error listing tables:', error);
      throw new Error(`Failed to list tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async describeTable(tableName: string): Promise<any[]> {
    try {
      const query = `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${tableName}'
        ORDER BY ordinal_position;
      `;

      return await this.executeQuery(query);
    } catch (error) {
      console.error('Error describing table:', error);
      throw new Error(
        `Failed to describe table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      const datasource = await getDataSourceSrv().get(this.datasourceName);

      if (!datasource) {
        throw new Error(`Datasource ${this.datasourceName} not found`);
      }

      const queryRequest: DataQueryRequest<any> = {
        requestId: 'postgres-query',
        interval: '1m',
        intervalMs: 60000,
        scopedVars: {},
        timezone: 'browser',
        app: 'sql-llm-copilot',
        startTime: Date.now(),
        targets: [
          {
            refId: 'A',
            rawSql: query,
            format: 'table',
            datasource: { type: 'postgres', uid: this.datasourceName },
          },
        ],
        range: {
          from: dateTime(Date.now() - 24 * 60 * 60 * 1000),
          to: dateTime(),
          raw: {
            from: 'now-24h',
            to: 'now',
          },
        },
      };

      const queryResult = datasource.query(queryRequest);
      const result = await (queryResult instanceof Promise ? queryResult : firstValueFrom(queryResult));

      if (!result || !result.data || result.data.length === 0) {
        return [];
      }

      // Convert Grafana's DataFrame format to simple array of objects
      const frame = result.data[0];
      if (!frame || !frame.fields) {
        return [];
      }

      const rows: any[] = [];
      const fields = frame.fields;
      const rowCount = frame.length || 0;

      for (let i = 0; i < rowCount; i++) {
        const row: any = {};
        fields.forEach((field: any) => {
          row[field.name] = field.values.get ? field.values.get(i) : field.values[i];
        });
        rows.push(row);
      }

      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTableCount(tableName: string): Promise<number> {
    try {
      const query = `SELECT COUNT(*) as count FROM "${tableName}";`;
      const result = await this.executeQuery(query);
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting table count:', error);
      throw new Error(
        `Failed to get count for table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getSampleData(tableName: string, limit = 10): Promise<any[]> {
    try {
      const query = `SELECT * FROM "${tableName}" LIMIT ${limit};`;
      return await this.executeQuery(query);
    } catch (error) {
      console.error('Error getting sample data:', error);
      throw new Error(
        `Failed to get sample data from table ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // MCP Tool definitions for use with the LLM
  static getMCPTools() {
    return {
      list_postgres_tables: {
        name: 'list_postgres_tables',
        description: 'List all tables in the PostgreSQL database',
        inputSchema: {
          type: 'object' as const,
          properties: {},
          required: [],
        },
      },
      describe_postgres_table: {
        name: 'describe_postgres_table',
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
      execute_postgres_query: {
        name: 'execute_postgres_query',
        description: 'Execute a custom SQL query against the PostgreSQL database',
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
      get_table_count: {
        name: 'get_table_count',
        description: 'Get the number of rows in a specific table',
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
      get_sample_data: {
        name: 'get_sample_data',
        description: 'Get sample data from a specific table',
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
    };
  }

  // Get list of PostgreSQL tool names dynamically
  static getToolNames(): string[] {
    return Object.keys(this.getMCPTools());
  }

  // Check if a tool name is a PostgreSQL tool
  static isPostgresTool(toolName: string): boolean {
    return this.getToolNames().includes(toolName);
  }
}

// Global instance for use in MCP tool handlers
export const postgresQueryTool = new PostgreSQLQueryTool();

// MCP Tool handlers
export const postgresToolHandlers = {
  list_postgres_tables: async () => {
    const tables = await postgresQueryTool.listTables();
    return {
      content: [
        {
          type: 'text',
          text: `Found ${tables.length} tables in the database:\n${tables.map((table) => `- ${table}`).join('\n')}`,
        },
      ],
    };
  },

  describe_postgres_table: async (args: { tableName: string }) => {
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
  },

  execute_postgres_query: async (args: { query: string }) => {
    // Basic safety check - prevent dangerous operations
    const query = args.query.trim().toLowerCase();
    if (
      query.includes('drop ') ||
      query.includes('delete ') ||
      query.includes('truncate ') ||
      query.includes('alter ')
    ) {
      throw new Error('Dangerous operations (DROP, DELETE, TRUNCATE, ALTER) are not allowed');
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
  },

  get_table_count: async (args: { tableName: string }) => {
    const count = await postgresQueryTool.getTableCount(args.tableName);

    return {
      content: [
        {
          type: 'text',
          text: `Table "${args.tableName}" contains ${count} rows`,
        },
      ],
    };
  },

  get_sample_data: async (args: { tableName: string; limit?: number }) => {
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
  },
};
