import React from 'react';

interface WelcomeMessageProps {
  onSuggestionClick?: (message: string) => void;
}

const conversationStarters = [
  {
    title: 'Show me all available tables',
    subtitle: 'in the PostgreSQL database',
    message: 'Show me all available tables',
  },
  {
    title: 'Create a query to monitor',
    subtitle: 'user activity over the last 24 hours',
    message: 'Create a query to monitor user activity over the last 24 hours',
  },
  {
    title: 'Help me build a dashboard',
    subtitle: 'for system performance metrics',
    message: 'Help me build a dashboard for system performance metrics',
  },
  {
    title: 'Explore table schemas',
    subtitle: 'and relationships in my database',
    message: 'Show me the table schemas and relationships in my database',
  },
  {
    title: 'Optimize an existing query',
    subtitle: 'for better performance',
    message: 'Help me optimize my SQL query for better performance',
  },
  {
    title: 'Create a time-series query',
    subtitle: 'for monitoring trends',
    message: 'Create a time-series query to monitor trends over time',
  },
  {
    title: 'Get sample data',
    subtitle: 'from key tables',
    message: 'Show me sample data from the main tables to understand the structure',
  },
  {
    title: 'Build a Grafana panel',
    subtitle: 'with custom SQL visualization',
    message: 'Help me build a Grafana panel with a custom SQL query',
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
