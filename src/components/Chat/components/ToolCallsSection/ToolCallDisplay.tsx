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
      return 'text-xs font-normal text-red-600';
    }
    if (running) {
      return 'text-xs font-normal text-yellow-600';
    }
    return 'text-xs font-normal text-green-600';
  };

  return (
    <div className="mb-1.5 p-2 bg-gray-100 rounded-sm border border-gray-300 text-xs border-l-4 border-l-blue-500">
      <div className="flex items-center font-bold mb-0.5 text-xs gap-2 flex-wrap">
        <span className="font-mono text-xs text-gray-900 bg-gray-50 p-0.5 rounded border border-gray-300 break-all break-words">
          {inlineDisplay}
        </span>
        <span className={getStatusClasses(toolCall.running, toolCall.error)}>
          {toolCall.error ? '✗ Error' : toolCall.running ? '⏳ Running' : '✓ Complete'}
        </span>
      </div>
      {toolCall.error && (
        <div className="whitespace-pre-wrap break-words overflow-y-auto font-mono text-xs text-red-600 mt-0.5 p-0.5 bg-gray-50 rounded max-h-25">
          Error: {toolCall.error}
        </div>
      )}
    </div>
  );
};
