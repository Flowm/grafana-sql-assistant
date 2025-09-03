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

  async getTableRowCount(tableName: string): Promise<number> {
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

  async executeQuery(query: string): Promise<any[]> {
    try {
      // Validate query for safety first
      this.validateQuery(query);

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

  // Validate SQL query for safety
  validateQuery(query: string): void {
    const lowerQuery = query.trim().toLowerCase();
    if (
      lowerQuery.includes('drop ') ||
      lowerQuery.includes('delete ') ||
      lowerQuery.includes('truncate ') ||
      lowerQuery.includes('alter ')
    ) {
      throw new Error('Dangerous operations (DROP, DELETE, TRUNCATE, ALTER) are not allowed');
    }
  }
}

// Global instance for use in MCP tool handlers
export const postgresQueryTool = new PostgreSQLQueryTool();
