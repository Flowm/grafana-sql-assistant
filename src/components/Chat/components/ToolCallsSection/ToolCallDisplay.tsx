import React from 'react';

interface ToolCallDisplayProps {
  toolCall: {
    name: string;
    arguments: string;
    running: boolean;
    error?: string;
    response?: any;
  };
}

export const ToolCallDisplay: React.FC<ToolCallDisplayProps> = ({ toolCall }) => {
  const formatInlineArguments = (args: string) => {
    try {
      const parsed = JSON.parse(args);
      // Format as compact inline object/parameters
      return JSON.stringify(parsed);
    } catch {
      return args;
    }
  };

  const inlineDisplay = `${toolCall.name}(${formatInlineArguments(toolCall.arguments)})`;

  const getStatusClasses = (running: boolean, error?: string) => {
    if (error) {
      return 'text-xs font-normal text-error';
    }
    if (running) {
      return 'text-xs font-normal text-warning';
    }
    return 'text-xs font-normal text-success';
  };

  return (
    <div className="mb-3 text-xs">
      <div className="flex items-center font-medium mb-1 text-xs gap-2 flex-wrap">
        <span className="font-mono text-xs text-primary bg-surface px-2 py-1 rounded break-all break-words">
          {inlineDisplay}
        </span>
        <span className={getStatusClasses(toolCall.running, toolCall.error)}>
          {toolCall.error ? '✗ Error' : toolCall.running ? '⏳ Running' : '✓ Complete'}
        </span>
      </div>
      {toolCall.error && (
        <div className="whitespace-pre-wrap break-words overflow-y-auto font-mono text-xs text-error mt-2 p-2 bg-surface rounded max-h-32">
          Error: {toolCall.error}
        </div>
      )}
    </div>
  );
};
