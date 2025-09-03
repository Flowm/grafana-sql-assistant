import React from 'react';

interface WelcomeMessageProps {
  onSuggestionClick?: (message: string) => void;
}

const conversationStarters = [
  {
    title: 'List all available tables',
    subtitle: 'in the database',
    message: 'List all available tables in the database',
  },
  {
    title: 'Explore table schemas',
    subtitle: 'and structure details',
    message: 'Show me the schema for the main tables in the database',
  },
  {
    title: 'Write a SQL query',
    subtitle: 'to analyze user activity data',
    message: 'Help me write a SQL query to analyze user activity data',
  },
  {
    title: 'Analyze data patterns',
    subtitle: 'and trends in my database',
    message: 'Help me analyze data patterns and trends in my database',
  },
  {
    title: 'Get sample data',
    subtitle: 'from the most important tables',
    message: 'Show me sample data from the most important tables',
  },
  {
    title: 'Create Grafana dashboard',
    subtitle: 'for monitoring key metrics',
    message: 'Help me create a Grafana dashboard for monitoring key metrics',
  },
  {
    title: 'Monitor Prometheus metrics',
    subtitle: 'for my application',
    message: 'What Prometheus metrics should I monitor for my application?',
  },
  {
    title: 'Observability best practices',
    subtitle: 'for my stack',
    message: 'What are the best practices for observability in my stack?',
  },
];

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSuggestionClick }) => {
  return (
    <div className="text-center pt-lg px-md">
      <div className="mb-lg">
        <div className="suggestions-header">
          <span className="suggestions-header-icon">⚡</span>
          <h3 className="suggestions-header-title">Suggestions</h3>
        </div>
        <p className="text-base text-secondary">
          Click on any suggestion below to get started, or type your own question:
        </p>
      </div>

      <div className="suggestions-grid">
        {conversationStarters.map((starter, index) => (
          <button key={index} onClick={() => onSuggestionClick?.(starter.message)} className="suggestion-card">
            <div className="suggestion-title">{starter.title}</div>
            <div className="suggestion-subtitle">{starter.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
