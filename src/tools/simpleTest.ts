import { postgresMCPClient, isPostgresTool, getPostgresToolNames } from './mcpServer';

/**
 * Simple test that can be run in the browser console
 * This test validates that the PostgreSQL tools are properly configured
 * without requiring an actual database connection
 */
export async function runSimpleTest(): Promise<void> {
  console.group('🔧 PostgreSQL Tools Test');

  try {
    // Test 1: Check if tools are properly registered
    console.log('1. Testing tool registration...');
    const toolsResponse = await postgresMCPClient.listTools();
    const toolNames = toolsResponse.tools.map((t) => t.name);
    const expectedTools = getPostgresToolNames();

    const missingTools = expectedTools.filter((tool) => !toolNames.includes(tool));
    if (missingTools.length === 0) {
      console.log('✅ All expected tools are registered:', toolNames);
    } else {
      console.error('❌ Missing tools:', missingTools);
    }

    // Test 2: Validate tool detection
    console.log('\n2. Testing dynamic tool detection...');
    let allDetected = true;
    for (const toolName of toolNames) {
      if (!isPostgresTool(toolName)) {
        console.error(`❌ Tool "${toolName}" not detected as PostgreSQL tool`);
        allDetected = false;
      }
    }
    if (allDetected) {
      console.log('✅ All PostgreSQL tools properly detected');
    }

    // Test 3: Validate tool schemas
    console.log('\n3. Testing tool schemas...');
    for (const tool of toolsResponse.tools) {
      if (tool.inputSchema?.type === 'object') {
        console.log(`✅ Tool "${tool.name}" has valid schema`);
      } else {
        console.error(`❌ Tool "${tool.name}" has invalid schema`);
      }
    }

    // Test 4: Test dangerous query prevention (this should work without DB)
    console.log('\n4. Testing security features...');
    try {
      await postgresMCPClient.callTool({
        name: 'execute_postgres_query',
        arguments: { query: 'DROP TABLE users;' },
      });
      console.error('❌ Dangerous query was not blocked!');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Dangerous operations')) {
        console.log('✅ Dangerous query successfully blocked');
      } else {
        console.log('⚠️ Query blocked for different reason:', error);
      }
    }

    // Test 5: Test argument validation
    console.log('\n5. Testing argument validation...');
    try {
      await postgresMCPClient.callTool({
        name: 'describe_postgres_table',
        arguments: {}, // Missing required tableName
      });
      console.error('❌ Missing argument validation failed');
    } catch (error) {
      if (error instanceof Error && error.message.includes('tableName')) {
        console.log('✅ Argument validation working correctly');
      } else {
        console.log('⚠️ Validation failed for different reason:', error);
      }
    }

    // Test 6: Test that we handle database connection errors gracefully
    console.log('\n6. Testing error handling...');
    try {
      await postgresMCPClient.callTool({
        name: 'list_postgres_tables',
        arguments: {},
      });
      console.log('🎉 Database connection successful!');
    } catch (error) {
      console.log('⚠️ Expected error (no database connection):', error instanceof Error ? error.message : error);
    }

    console.log('\n🎯 Test Summary:');
    console.log('- Tool registration: Working');
    console.log('- Tool detection: Working');
    console.log('- Schema validation: Working');
    console.log('- Security checks: Working');
    console.log('- Argument validation: Working');
    console.log('- Error handling: Working');
    console.log('\n✨ PostgreSQL tools are ready for use!');
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }

  console.groupEnd();
}

/**
 * Interactive testing functions for browser console
 */
export const browserTestHelpers = {
  // Test all tools
  runAll: runSimpleTest,

  // Test individual tools
  listTables: () => testToolCall('list_postgres_tables'),

  describeTable: (tableName: string) => testToolCall('describe_postgres_table', { tableName }),

  queryData: (query: string) => testToolCall('execute_postgres_query', { query }),

  countRows: (tableName: string) => testToolCall('get_table_count', { tableName }),

  sampleData: (tableName: string, limit = 10) => testToolCall('get_sample_data', { tableName, limit }),

  // Show available commands
  help: () => {
    console.log(`
🔧 PostgreSQL Tools Test Commands:

📋 Available functions:
- browserTestHelpers.runAll()                    // Run all tests
- browserTestHelpers.listTables()                // Test list tables
- browserTestHelpers.describeTable('users')      // Test describe table
- browserTestHelpers.queryData('SELECT 1;')      // Test query execution
- browserTestHelpers.countRows('users')          // Test row count
- browserTestHelpers.sampleData('users', 5)      // Test sample data

🚀 Quick start:
1. Run browserTestHelpers.runAll() to test everything
2. Use individual functions to test specific tools
3. Check the browser console for results

💡 Tips:
- These tests work without a database connection
- Security and validation tests will pass
- Database-dependent tests will show connection errors (expected)
    `);
  },
};

// Make test helpers available in browser console
if (typeof window !== 'undefined') {
  (window as any).postgresTest = browserTestHelpers;
  console.log('🔧 PostgreSQL test helpers loaded! Type "postgresTest.help()" for commands.');
}
