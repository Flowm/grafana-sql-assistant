import React from 'react';

export const WelcomeMessage: React.FC = () => (
  <div className="text-secondary text-center pt-lg">
    <p className="text-base text-primary mb-md">Start a conversation by asking questions about:</p>
    <ul className="text-left inline-block text-sm text-primary space-y-1">
      <li>• Listing database tables</li>
      <li>• Exploring table schemas and structure</li>
      <li>• Writing SQL queries</li>
      <li>• Analyzing your data</li>
      <li>• Getting sample data from tables</li>
      <li>• Grafana dashboards and panels</li>
      <li>• Prometheus metrics</li>
      <li>• Observability best practices</li>
    </ul>
  </div>
);
