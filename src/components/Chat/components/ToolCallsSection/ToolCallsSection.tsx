import React, { useState, useEffect } from 'react';
import { ToolCallDisplay } from './ToolCallDisplay';
import {
  toolCallsCollapsibleContainerStyles,
  toolCallsHeaderStyles,
  toolCallsHeaderHoverStyles,
  toolCallsContentStyles,
} from './ToolCallsSection.styles';

interface ToolCallsSectionProps {
  toolCalls: Array<{
    name: string;
    arguments: string;
    running: boolean;
    error?: string;
    response?: any;
  }>;
}

export const ToolCallsSection: React.FC<ToolCallsSectionProps> = ({ toolCalls }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const runningCount = toolCalls.filter((tc) => tc.running).length;
  const completedCount = toolCalls.filter((tc) => !tc.running && !tc.error).length;
  const errorCount = toolCalls.filter((tc) => tc.error).length;
  const hasRunningCalls = runningCount > 0;

  // Auto-expand when there are running calls
  useEffect(() => {
    if (hasRunningCalls) {
      setIsExpanded(true);
    }
  }, [hasRunningCalls]);

  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  const headerStyle = {
    ...toolCallsHeaderStyles,
    ...(isHovered ? toolCallsHeaderHoverStyles : {}),
  };

  return (
    <div style={toolCallsCollapsibleContainerStyles}>
      <div
        style={headerStyle}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>
          🔧 Tool Calls ({toolCalls.length}){runningCount > 0 && ` • ${runningCount} running`}
          {completedCount > 0 && ` • ${completedCount} completed`}
          {errorCount > 0 && ` • ${errorCount} failed`}
        </span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div style={toolCallsContentStyles}>
          {toolCalls.map((toolCall, index) => (
            <ToolCallDisplay key={index} toolCall={toolCall} />
          ))}
        </div>
      )}
    </div>
  );
};
