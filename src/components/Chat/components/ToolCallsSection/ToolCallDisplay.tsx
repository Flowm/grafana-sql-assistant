import React from 'react';
import {
  toolCallContainerStyles,
  toolCallHeaderStyles,
  toolCallArgumentsStyles,
  toolCallErrorStyles,
  toolCallStatusStyles,
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
  const formatArguments = (args: string) => {
    try {
      return JSON.stringify(JSON.parse(args), null, 2);
    } catch {
      return args;
    }
  };

  return (
    <div style={toolCallContainerStyles}>
      <div style={toolCallHeaderStyles}>
        <span>{toolCall.name}</span>
        <span style={toolCallStatusStyles(toolCall.running, toolCall.error)}>
          {toolCall.error ? '✗ Error' : toolCall.running ? '⏳ Running' : '✓ Complete'}
        </span>
      </div>
      <div style={toolCallArgumentsStyles}>{formatArguments(toolCall.arguments)}</div>
      {toolCall.error && (
        <div style={toolCallErrorStyles}>Error: {toolCall.error}</div>
      )}
    </div>
  );
};
