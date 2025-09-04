# SQL Assistant

## Overview

SQL Assistant is a Grafana app plugin that uses AI to help write SQL queries for dashboards and panels.
Users can chat with it in plain English and it will generate SQL queries based on the request.

The plugin can inspect connected PostgreSQL datasources through an MCP interface to understand table structures and relationships.
It then uses this context to generate relevant SQL queries based on the request.
Finally it can create and update Grafana dashboards and panels based on the generated queries through the Grafana MCP interface.

## Motivation

This plugin aims to optimize the time required to write custom SQL queries for complex PostgreSQL databases. LLMs can be a huge help to write and optimize these queries, but to work properly they need information about all relevant tables and associations.

Grafana recently released Grafana Assistant that goes a great step in this direction, but the initial focus on Grafana Cloud and only Prometheus and Loki datasources doesn't cover many use cases.

This plugin should initially be considered a POC and highly experimental, but happy to expand this depending on interest and feedback.

## Features

- **Natural Language to SQL**: Convert plain English questions into SQL queries
- **Schema Understanding**: Automatically analyzes the database structure to provide context-aware suggestions
- **Dashboard Integration**: Seamlessly create and update Grafana dashboard panels
- **Query Optimization**: Suggests improvements for better performance and accuracy
- **Conversational Interface**: Chat-based interaction for iterative query refinement

## Requirements

- Grafana 10.4.0 or later
- [Grafana LLM app plugin](https://grafana.com/grafana/plugins/grafana-llm-app/) enabled and configured with one of the supported AI providers (OpenAI, etc.)
- PostgreSQL datasource (other SQL databases may be supported in the future)

## Getting Started

1. **Install the Plugin**: Install SQL Assistant from the Grafana plugin catalog or manually upload the plugin files.

2. **Configure LLM**: Ensure the Grafana LLM plugin is installed and configured with the preferred AI provider (OpenAI, etc.).

3. **Setup Datasource**: Configure the PostgreSQL datasource in Grafana.

4. **Access SQL Assistant**: Navigate to the SQL Assistant app from the Grafana sidebar.

5. **Start Querying**: Begin a conversation by asking questions like:
   - "Show me all available tables"
   - "Create a query to monitor user activity over the last 24 hours"
   - "Help me build a dashboard for system performance metrics"

## Contributing

Contributions are welcome! Please submit issues, feature requests, or pull requests to help improve SQL Assistant.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
