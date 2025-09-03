import React from 'react';
import { welcomeMessageStyles, welcomeListStyles } from './WelcomeMessage.styles';

export const WelcomeMessage: React.FC = () => (
  <div style={welcomeMessageStyles}>
    <h4>Welcome to SQL LLM Copilot!</h4>
    <p>Start a conversation by asking questions about:</p>
    <ul style={welcomeListStyles}>
      <li>Listing database tables</li>
      <li>Exploring table schemas and structure</li>
      <li>Writing SQL queries</li>
      <li>Analyzing your data</li>
      <li>Getting sample data from tables</li>
      <li>Grafana dashboards and panels</li>
      <li>Prometheus metrics</li>
      <li>Observability best practices</li>
    </ul>
  </div>
);
