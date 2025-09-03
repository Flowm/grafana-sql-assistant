import React from 'react';

export const WelcomeMessage: React.FC = () => (
  <div className="text-gray-600 italic text-center pt-5">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">Welcome to SQL LLM Copilot!</h4>
    <p className="text-sm text-gray-700 mb-3">Start a conversation by asking questions about:</p>
    <ul className="text-left inline-block text-sm text-gray-700 space-y-1">
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
