import React, { useState, useEffect } from 'react';
import { ToolCallDisplay } from './ToolCallDisplay';

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

  return (
    <div className="rounded-lg border border-weak bg-background overflow-hidden mb-4">
      <div
        className={`flex justify-between items-center select-none cursor-pointer px-4 py-3 bg-surface text-sm font-medium transition-all duration-200 ${
          isHovered ? 'bg-background' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary">🔧</span>
          <span className="text-secondary">
            Tool Calls ({toolCalls.length})
            {runningCount > 0 && <span className="text-warning ml-1">• {runningCount} running</span>}
            {completedCount > 0 && <span className="text-success ml-1">• {completedCount} completed</span>}
            {errorCount > 0 && <span className="text-error ml-1">• {errorCount} failed</span>}
          </span>
        </div>
        <span className="text-secondary">{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="p-3 border-t border-weak bg-background">
          {toolCalls.map((toolCall, index) => (
            <ToolCallDisplay key={index} toolCall={toolCall} />
          ))}
        </div>
      )}
    </div>
  );
};
