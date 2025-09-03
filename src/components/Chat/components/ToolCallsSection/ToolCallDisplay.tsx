import React from 'react';
import {
  toolCallContainerStyles,
  toolCallHeaderStyles,
  toolCallErrorStyles,
  toolCallStatusStyles,
  toolCallInlineDisplayStyles,
} from './ToolCallsSection.styles';

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

  return (
    <div style={toolCallContainerStyles}>
      <div style={toolCallHeaderStyles}>
        <span style={toolCallInlineDisplayStyles}>{inlineDisplay}</span>
        <span style={toolCallStatusStyles(toolCall.running, toolCall.error)}>
          {toolCall.error ? '✗ Error' : toolCall.running ? '⏳ Running' : '✓ Complete'}
        </span>
      </div>
      {toolCall.error && <div style={toolCallErrorStyles}>Error: {toolCall.error}</div>}
    </div>
  );
};
