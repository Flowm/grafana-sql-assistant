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
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">⚡</span>
          <h3 className="text-lg font-semibold text-primary">Suggestions</h3>
        </div>
        <p className="text-base text-secondary">
          Click on any suggestion below to get started, or type your own question:
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 max-w-4xl mx-auto md:grid-cols-2">
        {conversationStarters.map((starter, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick?.(starter.message)}
            className="bg-background border border-weak rounded-xl p-4 transition-all duration-200 cursor-pointer text-left hover:bg-surface hover:border-medium hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:-translate-y-px group"
          >
            <div className="text-primary text-base font-medium leading-snug mb-1 transition-colors duration-200 group-hover:text-link">
              {starter.title}
            </div>
            <div className="text-secondary text-sm leading-tight">{starter.subtitle}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
